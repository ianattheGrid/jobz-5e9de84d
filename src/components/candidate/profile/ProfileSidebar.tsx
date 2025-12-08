import { User, Briefcase, Award, Image, Sparkles, Settings, Check, Circle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        {!collapsed && (
          <div>
            <h2 className="font-semibold text-foreground">Profile Builder</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Complete required sections to get matched
            </p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Required Sections */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            {!collapsed && "Required"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {requiredSections.map((section) => {
                const Icon = iconMap[section.icon as keyof typeof iconMap];
                const isActive = activeSection === section.id;
                const isComplete = completedSections.has(section.id);

                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(section.id)}
                      className={cn(
                        "w-full justify-start gap-3 transition-colors",
                        isActive && "bg-primary/10 text-primary border-l-2 border-primary",
                        !isActive && "hover:bg-muted/50"
                      )}
                      tooltip={collapsed ? section.label : undefined}
                    >
                      <div className="relative">
                        <Icon className="h-4 w-4" />
                        {isComplete && (
                          <Check className="absolute -right-1 -top-1 h-3 w-3 text-green-500" />
                        )}
                      </div>
                      {!collapsed && (
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{section.label}</span>
                            <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
                              Required
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground truncate">
                            {section.description}
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Optional Sections */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            {!collapsed && "Optional"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {optionalSections.map((section) => {
                const Icon = iconMap[section.icon as keyof typeof iconMap];
                const isActive = activeSection === section.id;
                const isComplete = completedSections.has(section.id);

                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(section.id)}
                      className={cn(
                        "w-full justify-start gap-3 transition-colors",
                        isActive && "bg-primary/10 text-primary border-l-2 border-primary",
                        !isActive && "hover:bg-muted/50"
                      )}
                      tooltip={collapsed ? section.label : undefined}
                    >
                      <div className="relative">
                        <Icon className="h-4 w-4" />
                        {isComplete && (
                          <Check className="absolute -right-1 -top-1 h-3 w-3 text-green-500" />
                        )}
                      </div>
                      {!collapsed && (
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">{section.label}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {section.description}
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              <span>{completedSections.size}/{PROFILE_SECTIONS.length} complete</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
