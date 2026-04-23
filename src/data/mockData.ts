export type PlacementType = 'Residential' | 'Supported Living' | 'Community-Based';
export type StatusType = 'Uploaded' | 'Processing' | 'Ready for Review' | 'Reviewed' | 'Needs Follow-up';
export type PriorityType = 'Low' | 'Medium' | 'High';

export interface Referral {
  id: string;
  patient_name: string;
  patient_avatar: string;
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
  status: StatusType;
  lastUpdated: string;
}

export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'REF-001',
    patient_name: 'Maria Lopez',
    patient_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    date_of_birth: '1994-05-12',
    referral_source: 'County Social Services',
    document_type: 'Service Plan (ISP)',
    urgency_level: 'Medium',
    patient_summary: 'Needs structured daily support and caregiver transition planning.',
    top_needs: ['Structured routine', 'Social skills'],
    key_flags: ['Caregiver burnout'],
    suggested_placement: 'Supported Living',
    placement_rationale: ['Parental support diminishing.'],
    recommended_next_step: 'Schedule site visit.',
    evidence_snippets: ["...requires significant structure..."],
    extraction_confidence: 'High',
    raw_extracted_text: 'Maria Lopez. ASD diagnosis...',
    status: 'Ready for Review',
    lastUpdated: '2026-04-22T14:30:00Z'
  },
  {
    id: 'REF-002',
    patient_name: 'Darnell Brooks',
    patient_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    date_of_birth: '1981-11-20',
    referral_source: 'St. Jude Medical Center',
    document_type: 'Discharge Summary',
    urgency_level: 'High',
    patient_summary: 'Requires 24/7 physical assistance post-discharge.',
    top_needs: ['24/7 Physical assistance', 'Accessibility'],
    key_flags: ['Housing instability', 'Discharge urgency'],
    suggested_placement: 'Residential',
    placement_rationale: ['Immediate housing instability post-hospital.'],
    recommended_next_step: 'Verify residential bed availability.',
    evidence_snippets: ["...requires 24/7 care..."],
    extraction_confidence: 'High',
    raw_extracted_text: 'Darnell Brooks. CP. Needs 24/7...',
    status: 'Ready for Review',
    lastUpdated: '2026-04-23T09:15:00Z'
  },
  {
    id: 'REF-003',
    patient_name: 'Asha Reed',
    patient_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    date_of_birth: '2007-03-15',
    referral_source: 'Regional Transition Center',
    document_type: 'Transition Plan',
    urgency_level: 'Low',
    patient_summary: 'Transition-age adult seeking vocational independence.',
    top_needs: ['Vocational training', 'Budgeting'],
    key_flags: ['Transition planning'],
    suggested_placement: 'Community-Based',
    placement_rationale: ['High level of independence.'],
    recommended_next_step: 'Route to vocational specialist.',
    evidence_snippets: ["...high potential for independence..."],
    extraction_confidence: 'High',
    raw_extracted_text: 'Asha Reed. Recent graduate...',
    status: 'Reviewed',
    lastUpdated: '2026-04-21T11:45:00Z'
  },
  {
    id: 'REF-004',
    patient_name: 'Jacob Miller',
    patient_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    date_of_birth: '1999-08-30',
    referral_source: 'Emergency Crisis Center',
    document_type: 'Crisis Report',
    urgency_level: 'High',
    patient_summary: 'Significant behavioral risk and medical oversight needed.',
    top_needs: ['Crisis de-escalation', 'Diabetes monitoring'],
    key_flags: ['Aggression risk', 'Medication oversight'],
    suggested_placement: 'Residential',
    placement_rationale: ['History of placement failures.'],
    recommended_next_step: 'Route to behavioral review team.',
    evidence_snippets: ["...intermittent aggression..."],
    extraction_confidence: 'High',
    raw_extracted_text: 'Jacob Miller. Aggressive episodes...',
    status: 'Needs Follow-up',
    lastUpdated: '2026-04-23T12:00:00Z'
  },
  {
    id: 'REF-005',
    patient_name: 'Zoe Carter',
    patient_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    date_of_birth: '2005-08-14',
    referral_source: 'Westside Transition Services',
    document_type: 'IEP / Transition Plan',
    urgency_level: 'Low',
    patient_summary: 'Low clinical acuity. Primary goals are community integration.',
    top_needs: ['Vocational coaching', 'Transportation'],
    key_flags: ['Transition planning'],
    suggested_placement: 'Community-Based',
    placement_rationale: ['Stable environment and independent ADLs.'],
    recommended_next_step: 'Schedule community program intake.',
    evidence_snippets: ["...wants to increase independence..."],
    extraction_confidence: 'High',
    raw_extracted_text: 'Zoe Carter. Lives with aunt. Stable home...',
    status: 'Ready for Review',
    lastUpdated: '2026-04-23T15:30:00Z'
  }
];
