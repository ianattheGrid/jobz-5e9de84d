import { User, Briefcase, Award, Image, Star, RefreshCw, Brain, Percent, Eye, Check, Circle, HelpCircle, Compass, Rocket, TrendingUp, Zap } from "lucide-react";
import { PROFILE_SECTIONS, ProfileSectionId } from "./types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Briefcase,
  Award,
  Image,
  Star,
  RefreshCw,
  Brain,
  Percent,
  Eye,
  Compass,
  Rocket,
  TrendingUp,
  Zap,
};

// Extended descriptions for career stages
const CAREER_STAGE_TOOLTIPS: Record<string, string> = {
  'launchpad': "Perfect for first-time job seekers, graduates, or those with 0-2 years experience. Show employers your potential, enthusiasm, and what drives you.",
  'ascent': "For those building their career with 2-5 years experience. Highlight your growth trajectory, key achievements, and expanding expertise.",
  'core': "For established professionals with 5+ years experience. Showcase your deep expertise, leadership capabilities, and track record of success.",
  'pivot': "For career changers looking for a new direction. Explain your transferable skills and why you're excited about this new path.",
  'encore': "For semi-retired or returning professionals. Share your wealth of experience and what meaningful work looks like to you now.",
};

interface ProfileSidebarProps {
  activeSection: ProfileSectionId;
  onSectionChange: (section: ProfileSectionId) => void;
  completedSections: Set<ProfileSectionId>;
}

export function ProfileSidebar({ 
  activeSection, 
  onSectionChange, 
  completedSections 
}: ProfileSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const requiredSections = PROFILE_SECTIONS.filter(s => s.required);
  const optionalSections = PROFILE_SECTIONS.filter(s => !s.required);

  // Check if this is a career stage section
  const isCareerStage = (id: string) => ['launchpad', 'ascent', 'core', 'pivot', 'encore'].includes(id);

  const SectionItem = ({ section }: { section: typeof PROFILE_SECTIONS[0] }) => {
    const Icon = iconMap[section.icon] || User;
    const isActive = activeSection === section.id;
    const isComplete = completedSections.has(section.id);
    const hasExtendedTooltip = isCareerStage(section.id);
    const tooltipText = hasExtendedTooltip ? CAREER_STAGE_TOOLTIPS[section.id] : section.description;

    // For career stage items, separate the help icon into a Popover
    if (!collapsed && hasExtendedTooltip) {
      return (
        <SidebarMenuItem>
          <div className="flex items-center w-full">
            <SidebarMenuButton
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex-1 h-10 px-3 gap-3 rounded-md transition-all",
                isActive 
                  ? "bg-primary/20 text-primary font-medium shadow-sm" 
                  : "hover:bg-white/50 text-foreground"
              )}
              tooltip={collapsed ? section.label : undefined}
            >
              <div className="relative flex-shrink-0">
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {isComplete && (
                  <Check className="absolute -right-1 -bottom-1 h-3 w-3 text-green-500 bg-background rounded-full" />
                )}
              </div>
              <span className="text-sm truncate flex-1">{section.label}</span>
            </SidebarMenuButton>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 flex-shrink-0 hover:bg-primary/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-72 z-50 bg-white/95 backdrop-blur-sm border-primary/20">
                <p className="font-medium text-foreground mb-1">{section.label}</p>
                <p className="text-sm text-muted-foreground">{tooltipText}</p>
              </PopoverContent>
            </Popover>
          </div>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => onSectionChange(section.id)}
          className={cn(
            "w-full h-10 px-3 gap-3 rounded-md transition-all",
            isActive 
              ? "bg-primary/20 text-primary font-medium shadow-sm" 
              : "hover:bg-white/50 text-foreground"
          )}
          tooltip={collapsed ? section.label : undefined}
        >
          <div className="relative flex-shrink-0">
            <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
            {isComplete && (
              <Check className="absolute -right-1 -bottom-1 h-3 w-3 text-green-500 bg-background rounded-full" />
            )}
          </div>
          {!collapsed && (
            <span className="text-sm truncate flex-1">{section.label}</span>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-primary/20 bg-gradient-to-b from-primary/5 via-rose-50/50 to-primary/10 shadow-[4px_0_20px_rgba(236,72,153,0.08)]"
    >
      <SidebarHeader className="border-b border-primary/20 p-4 bg-white/30">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Profile Builder</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10">
                  <HelpCircle className="h-4 w-4 text-primary/70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-80 bg-white/95 backdrop-blur-sm border-primary/20">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">How Profile Builder Works</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete the <strong>Required</strong> sections to get matched with employers. 
                    Optional sections are tailored to your career stage and help you stand out.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Each section saves independently</li>
                    <li>Green checkmarks show completed sections</li>
                    <li>Use Preview to see how employers view your profile</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Required Sections */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-primary/70 px-3 mb-2">
            {!collapsed && "Required"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {requiredSections.map((section) => (
                <SectionItem key={section.id} section={section} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && <Separator className="my-4 bg-primary/10" />}

        {/* Optional / Career Stage Sections */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-primary/70 px-3 mb-2">
            {!collapsed && "Career Stages & Optional"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {optionalSections.map((section) => (
                <SectionItem key={section.id} section={section} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-primary/20 p-4 bg-white/30">
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
            <span>{completedSections.size}/{PROFILE_SECTIONS.length} complete</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
