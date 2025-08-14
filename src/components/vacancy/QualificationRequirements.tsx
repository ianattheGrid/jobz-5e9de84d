import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  educationLevels,
  fieldsOfStudy,
  getCertificationsForWorkArea,
  securityClearanceLevels,
  professionalMemberships,
  languageRequirements,
  languageProficiencyLevels,
  drivingLicenseTypes,
  backgroundCheckTypes
} from "@/constants/qualificationOptions";

interface QualificationRequirementsProps {
  control: Control<any>;
}

const QualificationRequirements = ({ control }: QualificationRequirementsProps) => {
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<{language: string, level: string}[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [selectedBackgroundChecks, setSelectedBackgroundChecks] = useState<string[]>([]);

  // Watch the toggle fields and work area
  const workArea = useWatch({ control, name: "work_area" });
  const requiresEducation = useWatch({ control, name: "requires_education" });
  const requiresCertifications = useWatch({ control, name: "requires_certifications" });
  const requiresSecurityClearance = useWatch({ control, name: "requires_security_clearance" });
  const requiresMemberships = useWatch({ control, name: "requires_memberships" });
  const requiresLanguages = useWatch({ control, name: "requires_languages" });
  const requiresDrivingLicense = useWatch({ control, name: "requires_driving_license" });
  const requiresBackgroundCheck = useWatch({ control, name: "requires_background_check" });

  // Get certifications for the current work area
  const availableCertifications = getCertificationsForWorkArea(workArea || "IT");
  
  // Clear selected certifications when work area changes
  useEffect(() => {
    setSelectedCertifications([]);
  }, [workArea]);

  const addCertification = (cert: string) => {
    if (!selectedCertifications.includes(cert)) {
      setSelectedCertifications([...selectedCertifications, cert]);
    }
  };

  const removeCertification = (cert: string) => {
    setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
  };

  const addMembership = (membership: string) => {
    if (!selectedMemberships.includes(membership)) {
      setSelectedMemberships([...selectedMemberships, membership]);
    }
  };

  const removeMembership = (membership: string) => {
    setSelectedMemberships(selectedMemberships.filter(m => m !== membership));
  };

  const addLanguage = (language: string, level: string) => {
    const exists = selectedLanguages.find(l => l.language === language);
    if (!exists) {
      setSelectedLanguages([...selectedLanguages, { language, level }]);
    }
  };

  const removeLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter(l => l.language !== language));
  };

  const addLicense = (license: string) => {
    if (!selectedLicenses.includes(license)) {
      setSelectedLicenses([...selectedLicenses, license]);
    }
  };

  const removeLicense = (license: string) => {
    setSelectedLicenses(selectedLicenses.filter(l => l !== license));
  };

  const addBackgroundCheck = (check: string) => {
    if (!selectedBackgroundChecks.includes(check)) {
      setSelectedBackgroundChecks([...selectedBackgroundChecks, check]);
    }
  };

  const removeBackgroundCheck = (check: string) => {
    setSelectedBackgroundChecks(selectedBackgroundChecks.filter(c => c !== check));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Qualification Requirements
        </CardTitle>
        <CardDescription>
          Specify any educational, professional, or regulatory requirements for this role
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Educational Qualifications */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="requires_education"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">
                    Educational Qualifications Required
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Does this role require specific educational qualifications?
                  </p>
                </div>
              </FormItem>
            )}
          />

          {requiresEducation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <FormField
                control={control}
                name="required_education_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Education Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="preferred_field_of_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Field of Study</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select field of study" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {fieldsOfStudy.map((field) => (
                          <SelectItem key={field} value={field}>{field}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Professional Certifications */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="requires_certifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">
                    Professional Certifications Required
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Does this role require specific industry certifications?
                  </p>
                </div>
              </FormItem>
            )}
          />

          {requiresCertifications && (
            <div className="ml-6 space-y-3">
              <Select onValueChange={addCertification}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Add certification requirement" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {availableCertifications
                    .filter(cert => !selectedCertifications.includes(cert))
                    .map((cert) => (
                    <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedCertifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCertifications.map((cert) => (
                    <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeCertification(cert)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security Clearance */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="requires_security_clearance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">
                    Security Clearance Required
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Does this role require security clearance?
                  </p>
                </div>
              </FormItem>
            )}
          />

          {requiresSecurityClearance && (
            <div className="ml-6">
              <FormField
                control={control}
                name="required_security_clearance_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Clearance Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select clearance level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {securityClearanceLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Professional Memberships */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="requires_memberships"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">
                    Professional Memberships Required
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Does this role require professional body memberships?
                  </p>
                </div>
              </FormItem>
            )}
          />

          {requiresMemberships && (
            <div className="ml-6 space-y-3">
              <Select onValueChange={addMembership}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Add membership requirement" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {professionalMemberships
                    .filter(membership => !selectedMemberships.includes(membership))
                    .map((membership) => (
                    <SelectItem key={membership} value={membership}>{membership}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedMemberships.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMemberships.map((membership) => (
                    <Badge key={membership} variant="secondary" className="flex items-center gap-1">
                      {membership}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeMembership(membership)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Language Requirements */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="requires_languages"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">
                    Language Requirements
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Does this role require specific language skills?
                  </p>
                </div>
              </FormItem>
            )}
          />

          {requiresLanguages && (
            <div className="ml-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Select onValueChange={(language) => {
                  const level = "Intermediate (B1-B2)"; // Default level
                  addLanguage(language, level);
                }}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {languageRequirements
                      .filter(lang => !selectedLanguages.find(l => l.language === lang))
                      .map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.map((lang) => (
                    <Badge key={lang.language} variant="secondary" className="flex items-center gap-1">
                      {lang.language} ({lang.level})
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeLanguage(lang.language)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Driving License */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="requires_driving_license"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">
                    Driving License Required
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Does this role require a driving license?
                  </p>
                </div>
              </FormItem>
            )}
          />

          {requiresDrivingLicense && (
            <div className="ml-6 space-y-3">
              <Select onValueChange={addLicense}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Add license requirement" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {drivingLicenseTypes
                    .filter(license => !selectedLicenses.includes(license))
                    .map((license) => (
                    <SelectItem key={license} value={license}>{license}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedLicenses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedLicenses.map((license) => (
                    <Badge key={license} variant="secondary" className="flex items-center gap-1">
                      {license}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeLicense(license)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Background Checks */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="requires_background_check"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">
                    Background Checks Required
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Does this role require background verification?
                  </p>
                </div>
              </FormItem>
            )}
          />

          {requiresBackgroundCheck && (
            <div className="ml-6 space-y-3">
              <Select onValueChange={addBackgroundCheck}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Add background check requirement" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {backgroundCheckTypes
                    .filter(check => !selectedBackgroundChecks.includes(check))
                    .map((check) => (
                    <SelectItem key={check} value={check}>{check}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedBackgroundChecks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedBackgroundChecks.map((check) => (
                    <Badge key={check} variant="secondary" className="flex items-center gap-1">
                      {check}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeBackgroundCheck(check)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
};

export default QualificationRequirements;