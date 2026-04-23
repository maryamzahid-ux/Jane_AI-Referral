import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import type { Referral, PlacementType } from '../data/mockData';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return extractTextFromPDF(file);
  } else if (extension === 'docx') {
    return extractTextFromDOCX(file);
  } else if (extension === 'txt') {
    return file.text();
  } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
    return extractTextFromImage(file);
  } else {
    return "Unsupported file type for automated extraction.";
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
    });
    
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    if (!fullText.trim()) {
      return "Extraction successful but no text found in PDF. Scanned document suspected.";
    }

    return fullText;
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    return `Error extracting PDF: ${error instanceof Error ? error.message : String(error)}`;
  }
}

async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractTextFromImage(file: File): Promise<string> {
  const result = await Tesseract.recognize(file, 'eng');
  return result.data.text;
}

export interface AnalysisResult {
  patient_name: string;
  date_of_birth: string;
  referral_source: string;
  document_type: string;
  urgency_level: 'Low' | 'Medium' | 'High';
  patient_summary: string;
  top_needs: string[];
  key_flags: string[];
  suggested_placement: PlacementType;
  placement_rationale: string[];
  recommended_next_step: string;
  evidence_snippets: string[];
  extraction_confidence: 'High' | 'Medium' | 'Low';
  raw_extracted_text: string;
}

export function analyzeReferralText(text: string, fileName: string): AnalysisResult {
  const lowerText = text.toLowerCase();
  
  // 1. Snapshot Extraction
  const nameMatch = text.match(/Name:\s*([A-Za-z\s]+)/i) || text.match(/Patient:\s*([A-Za-z\s]+)/i);
  const patient_name = nameMatch ? nameMatch[1].trim() : fileName.split('.')[0].replace(/low priority referral /gi, '').replace(/[-_]/g, ' ');

  const dobMatch = text.match(/DOB:\s*([\d\/\-]+)/i) || text.match(/Birth:\s*([\d\/\-]+)/i);
  const date_of_birth = dobMatch ? dobMatch[1].trim() : 'Unknown';

  // 2. Enhanced Keyword Detection with Strict Negative Context
  const getSignal = (keywords: string[]) => {
    return keywords.filter(kw => {
      const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'g');
      let match;
      while ((match = regex.exec(lowerText)) !== null) {
        const index = match.index;
        // Check 35 chars before and 30 chars after for negation
        const contextBefore = lowerText.substring(Math.max(0, index - 35), index);
        const contextAfter = lowerText.substring(index, Math.min(lowerText.length, index + 30));
        
        const isNegated = 
          /\b(no|none|not|denies|denied|denying|negative|without|history of no|no history of|neither|never|zero)\b/i.test(contextBefore) ||
          /\b(none|negative|not present|not identified|denied)\b/i.test(contextAfter);
        
        if (!isNegated) return true;
      }
      return false;
    }).length > 0;
  };

  const signals = {
    // High Acuity
    medical_high: getSignal(['wheelchair', 'transfer', '24/7 care', 'nursing', 'feeding tube', 'seizure', 'insulin', 'medical fragility', 'trach', 'suction']),
    aggression: getSignal(['aggression', 'aggressive', 'physical outburst', 'physical violence', 'hitting', 'kicking', 'assault']),
    safety: getSignal(['elopement', 'suicidal', 'harm to self', 'danger to self', 'danger to others', 'safety concern']),
    crisis: getSignal(['emergency discharge', 'eviction', 'failed placement', 'homelessness', 'immediate need', 'urgent placement']),

    // Moderate
    medical_mod: getSignal(['diabetes', 'medication oversight', 'chronic condition', 'asthma', 'inhaler']),
    behavior_mod: getSignal(['anxiety', 'agitation', 'redirection', 'verbal outburst', 'frustration']),
    support_mod: getSignal(['caregiver strain', 'caregiver burnout', 'medication reminders', 'daily structure', 'routine']),

    // Low / Positive
    stable: getSignal(['stable home', 'supportive family', 'stable environment', 'lives with']),
    independent: getSignal(['independent', 'independence', 'self-care', 'manages medications']),
    vocational: getSignal(['vocational', 'job', 'employment', 'work', 'library', 'administrative', 'retail', 'college']),
    transition: getSignal(['transition age', 'transitioning', 'school-based', 'iep', 'graduation'])
  };

  // 3. Scoring Engine
  let medicalScore = 0;
  let behavioralScore = 0;
  let urgencyScore = 0;

  if (signals.medical_high) medicalScore += 3;
  if (signals.medical_mod) medicalScore += 1;
  
  if (signals.aggression) behavioralScore += 3;
  if (signals.safety) behavioralScore += 2;
  if (signals.behavior_mod) behavioralScore += 1;

  if (signals.crisis) urgencyScore += 3;
  if (signals.support_mod) urgencyScore += 1;

  // Independence Multiplier (Down-weighting)
  if (signals.independent || signals.stable) {
    medicalScore = Math.max(0, medicalScore - 2);
    behavioralScore = Math.max(0, behavioralScore - 2);
    urgencyScore = Math.max(0, urgencyScore - 1);
  }

  // 4. Decision Logic
  let urgency_level: 'Low' | 'Medium' | 'High' = 'Low';
  let suggested_placement: PlacementType = 'Community-Based';
  let placement_rationale: string[] = [];
  let recommended_next_step = "";
  let patient_summary = "";

  if (urgencyScore >= 3 || medicalScore >= 3 || behavioralScore >= 3) {
    urgency_level = 'High';
    suggested_placement = 'Residential';
    placement_rationale = [
      medicalScore >= 3 ? "Complex medical needs require specialized, staff-led clinical support." : "Significant behavioral risks necessitate a highly structured environment.",
      urgencyScore >= 3 ? "Immediate environmental instability or crisis status detected." : "Current community support levels are insufficient for safety.",
      "High intensity support required for all major life domains."
    ];
    recommended_next_step = medicalScore >= 3 ? "Verify medical-intensive residential bed availability." : "Route to clinical team for high-acuity behavioral review.";
    patient_summary = "High acuity case requiring intensive residential oversight due to documented safety or medical risks.";
  } else if (urgencyScore >= 1 || medicalScore >= 1 || behavioralScore >= 1) {
    urgency_level = 'Medium';
    suggested_placement = 'Supported Living';
    placement_rationale = [
      "Moderate support needs identified for routine and medication management.",
      "Benefit from background supervision and caregiver relief.",
      "Candidate for community integration with staff support."
    ];
    recommended_next_step = "Schedule clinical intake assessment and site visit.";
    patient_summary = "Moderate needs identified. Focus on routine stability and caregiver transition.";
  } else {
    urgency_level = 'Low';
    suggested_placement = (signals.vocational || signals.transition) ? 'Community-Based' : 'Supported Living';
    placement_rationale = [
      "Stable environment and independent ADLs identified in documentation.",
      "No active medical or behavioral safety risks detected.",
      "Primary focus is on vocational growth and community independence."
    ];
    recommended_next_step = "Route to vocational specialist for community program intake.";
    patient_summary = "Low clinical acuity. Primary goals are community integration and vocational development.";
  }

  // 5. Flags & Needs
  const top_needs = [];
  if (urgency_level === 'Low') {
    if (signals.vocational) top_needs.push('Vocational coaching', 'Job development');
    if (signals.transition) top_needs.push('Transportation training', 'Community navigation');
    top_needs.push('Budgeting support', 'Social peer groups');
  } else if (urgency_level === 'Medium') {
    top_needs.push('Medication oversight', 'Routine management', 'Social integration');
  } else {
    top_needs.push(signals.medical_high ? '24/7 Clinical care' : 'Crisis de-escalation', 'Secure residential', 'Intensive ADL support');
  }

  const key_flags = [];
  if (urgency_level === 'High') {
    if (signals.aggression || signals.safety) key_flags.push('Safety/Risk Alert');
    if (signals.medical_high) key_flags.push('Medical Fragility');
    if (signals.crisis) key_flags.push('Crisis Status');
  } else if (urgency_level === 'Medium') {
    if (signals.support_mod) key_flags.push('Caregiver Strain');
    if (signals.medical_mod) key_flags.push('Medical Monitoring');
  } else {
    if (signals.transition) key_flags.push('Transition Planning');
    if (signals.vocational) key_flags.push('Vocational Placement');
  }

  // 6. Evidence Snippets
  const evidence_snippets = text.split('\n')
    .filter(line => line.length > 30)
    .filter(line => {
      const l = line.toLowerCase();
      if (urgency_level === 'High') return /medical|aggressive|crisis|safety|discharge/i.test(l);
      if (urgency_level === 'Low') return /independent|vocational|stable|community|iep|transition/i.test(l);
      return /support|medication|routine|caregiver/i.test(l);
    })
    .slice(0, 2)
    .map(s => s.trim());

  return {
    patient_name,
    date_of_birth,
    referral_source: text.includes('Hospital') ? 'Medical Center' : text.includes('School') ? 'School Transition Services' : 'County Services',
    document_type: fileName.includes('IEP') ? 'IEP / Transition Plan' : 'Referral Assessment',
    urgency_level,
    patient_summary,
    top_needs: top_needs.slice(0, 4),
    key_flags: key_flags.slice(0, 3),
    suggested_placement,
    placement_rationale,
    recommended_next_step,
    evidence_snippets,
    extraction_confidence: text.length > 400 ? 'High' : 'Medium',
    raw_extracted_text: text
  };
}
