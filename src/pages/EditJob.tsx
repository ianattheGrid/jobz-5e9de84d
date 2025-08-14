import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LayoutDashboard, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useState, useEffect } from 'react';

export default function EditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    company: '',
    salary_min: 0,
    salary_max: 0,
    company_benefits: '',
    holiday_entitlement: 0,
  });

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) throw new Error('Job ID is required');
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        company: job.company || '',
        salary_min: job.salary_min || 0,
        salary_max: job.salary_max || 0,
        company_benefits: job.company_benefits || '',
        holiday_entitlement: job.holiday_entitlement || 0,
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!id) throw new Error('Job ID is required');

      const { error } = await supabase
        .from('jobs')
        .update(formData)
        .eq('id', parseInt(id));

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job updated successfully",
      });

      navigate('/employer/manage-jobs');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update job",
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        Job not found or you don't have permission to edit this job.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end mb-4">
        <Link to="/employer/manage-jobs">
          <Button 
            className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Back to Manage Jobs
          </Button>
        </Link>
      </div>

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/employer/dashboard" className="text-primary hover:text-primary/90">
              Employer Dashboard
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/employer/manage-jobs" className="text-primary hover:text-primary/90">
              Manage Jobs
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-white">Edit Job</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Job: {job.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter job title"
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Job location"
              />
            </div>

            <div>
              <Label htmlFor="salary_min">Minimum Salary (£)</Label>
              <Input
                id="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: parseInt(e.target.value) || 0 })}
                placeholder="Minimum salary"
              />
            </div>

            <div>
              <Label htmlFor="salary_max">Maximum Salary (£)</Label>
              <Input
                id="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: parseInt(e.target.value) || 0 })}
                placeholder="Maximum salary"
              />
            </div>

            <div>
              <Label htmlFor="holiday_entitlement">Holiday Entitlement (days)</Label>
              <Input
                id="holiday_entitlement"
                type="number"
                value={formData.holiday_entitlement}
                onChange={(e) => setFormData({ ...formData, holiday_entitlement: parseInt(e.target.value) || 0 })}
                placeholder="Holiday days"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role and responsibilities"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="company_benefits">Company Benefits</Label>
            <Textarea
              id="company_benefits"
              value={formData.company_benefits}
              onChange={(e) => setFormData({ ...formData, company_benefits: e.target.value })}
              placeholder="List company benefits"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link to="/employer/manage-jobs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}