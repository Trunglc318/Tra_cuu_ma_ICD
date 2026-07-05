import { MedicalCode } from "./data/medical_codes";

export interface PatientCase {
  id: string;
  patientName: string;
  insuranceId: string;
  diagnoses: MedicalCode[];
  procedures: MedicalCode[];
  herbs: MedicalCode[];
  createdAt: string;
  customNotes?: string;
}

export interface AiSearchResult {
  clinicalAnalysis: string;
  icd10Diagnoses: Array<{
    code: string;
    name: string;
    reason: string;
  }>;
  yhctDiseases: Array<{
    code: string;
    name: string;
    mappingCode: string;
    reason: string;
  }>;
  yhctProcedures: Array<{
    code: string;
    name: string;
    indication: string;
    billingNote: string;
  }>;
  herbs: Array<{
    code: string;
    name: string;
    purpose: string;
    billingNote: string;
  }>;
  billingTips: string;
}
