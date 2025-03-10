
import { Control } from "react-hook-form";
import ITSpecializationSelect from "../specializations/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "../specializations/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "../specializations/FinanceSpecializationSelect";
import PublicSectorSpecializationSelect from "../specializations/PublicSectorSpecializationSelect";
import EngineeringSpecializationSelect from "../specializations/EngineeringSpecializationSelect";
import HospitalitySpecializationSelect from "../specializations/HospitalitySpecializationSelect";
import HRSpecializationSelect from "../specializations/HRSpecializationSelect";
import LegalSpecializationSelect from "../specializations/LegalSpecializationSelect";
import ManufacturingSpecializationSelect from "../specializations/ManufacturingSpecializationSelect";
import EnergySpecializationSelect from "../specializations/EnergySpecializationSelect";
import PharmaSpecializationSelect from "../specializations/PharmaSpecializationSelect";
import RDSpecializationSelect from "../specializations/RDSpecializationSelect";
import SalesSpecializationSelect from "../specializations/SalesSpecializationSelect";

interface SpecializationSelectsProps {
  control: Control<any>;
  showSpecializations: {
    it: boolean;
    customerService: boolean;
    finance: boolean;
    publicSector: boolean;
    engineering: boolean;
    hospitality: boolean;
    hr: boolean;
    legal: boolean;
    manufacturing: boolean;
    energy: boolean;
    pharma: boolean;
    rd: boolean;
    sales: boolean;
  };
  onSpecialisationChange: (value: string) => void;
}

export const SpecializationSelects = ({
  control,
  showSpecializations,
  onSpecialisationChange
}: SpecializationSelectsProps) => {
  const {
    it, customerService, finance, publicSector,
    engineering, hospitality, hr, legal,
    manufacturing, energy, pharma, rd, sales
  } = showSpecializations;

  return (
    <>
      {it && (
        <ITSpecializationSelect 
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {customerService && (
        <CustomerServiceSpecializationSelect 
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {finance && (
        <FinanceSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {publicSector && (
        <PublicSectorSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {engineering && (
        <EngineeringSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {hospitality && (
        <HospitalitySpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {hr && (
        <HRSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {legal && (
        <LegalSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {manufacturing && (
        <ManufacturingSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {energy && (
        <EnergySpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {pharma && (
        <PharmaSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {rd && (
        <RDSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
      {sales && (
        <SalesSpecializationSelect
          control={control}
          onSpecializationChange={onSpecialisationChange}
        />
      )}
    </>
  );
};
