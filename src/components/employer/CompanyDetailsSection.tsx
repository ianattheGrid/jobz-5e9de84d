
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { companySizeOptions } from "@/config/company-size";

interface CompanyDetailsSectionProps {
  control: Control<any>;
}

export function CompanyDetailsSection({ control }: CompanyDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Company Details</h3>
      
      <FormField
        control={control}
        name="company_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900 font-medium">Company Size</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value ? field.value.toString() : undefined}
            >
              <FormControl>
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {companySizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The number of employees at your company
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="is_sme"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="text-gray-900 font-medium">SME Status</FormLabel>
              <FormDescription>
                Is your company a Small or Medium-sized Enterprise (less than 500 employees)?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="company_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900 font-medium">Company Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell candidates about your company culture, mission, and values..."
                className="resize-y h-32 bg-white border-gray-200 text-gray-900"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Maximum 1000 characters. This will help candidates understand your company better.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="office_amenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900 font-medium">Office Amenities</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe amenities available in your office (e.g., gym, cafeteria, game room, etc.)"
                className="resize-y h-24 bg-white border-gray-200 text-gray-900"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Maximum 500 characters. List perks available at your workplace.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="nearby_amenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900 font-medium">Nearby Amenities</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe amenities close to your office (e.g., restaurants, parks, transport links)"
                className="resize-y h-24 bg-white border-gray-200 text-gray-900"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Maximum 500 characters. What's available around your workplace?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
