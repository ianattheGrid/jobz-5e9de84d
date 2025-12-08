import { User, Briefcase, Award, Image, Sparkles, Settings, Check, Circle, HelpCircle } from "lucide-react";
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

const iconMap = {
  User,
  Briefcase,
  Award,
  Image,
  Sparkles,
  Settings,
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

  const SectionItem = ({ section }: { section: typeof PROFILE_SECTIONS[0] }) => {
    const Icon = iconMap[section.icon as keyof typeof iconMap];
    const isActive = activeSection === section.id;
    const isComplete = completedSections.has(section.id);

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => onSectionChange(section.id)}
          className={cn(
            "w-full h-10 px-3 gap-3 rounded-md transition-all",
            isActive 
              ? "bg-primary/10 text-primary font-medium" 
              : "hover:bg-muted/50 text-foreground"
          )}
          tooltip={collapsed ? section.label : undefined}
        >
          <div className="relative flex-shrink-0">
            <Icon className="h-5 w-5" />
            {isComplete && (
              <Check className="absolute -right-1 -bottom-1 h-3 w-3 text-green-500 bg-background rounded-full" />
            )}
          </div>
          {!collapsed && (
            <span className="text-sm truncate">{section.label}</span>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Profile Builder</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-80">
                <div className="space-y-3">
                  <h4 className="font-medium">How Profile Builder Works</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete the <strong>Required</strong> sections to get matched with employers. 
                    Optional sections help you stand out.
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
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-3 mb-2">
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

        {!collapsed && <Separator className="my-4" />}

        {/* Optional Sections */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-3 mb-2">
            {!collapsed && "Optional"}
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

      <SidebarFooter className="border-t border-border/40 p-4">
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
