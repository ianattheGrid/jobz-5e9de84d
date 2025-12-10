export const WORK_STYLE_OPTIONS = [
  { key: 'punctual', label: "I'm usually on time and don't like letting people down" },
  { key: 'calm_under_pressure', label: "I stay pretty calm when things get busy" },
  { key: 'team_player', label: "I like working with other people as part of a team" },
  { key: 'focused', label: "I prefer getting my head down and focusing on tasks" },
  { key: 'quick_learner', label: "I learn new systems/apps quickly" },
  { key: 'customer_facing', label: "I'm happy talking to customers or the public" },
  { key: 'detail_oriented', label: "I notice small mistakes and like to fix them" },
  { key: 'organised', label: "I like having a clear plan and checklist" },
  { key: 'independent', label: "I'm good at figuring things out on my own" },
  { key: 'asks_questions', label: "I don't mind asking questions if I'm not sure" },
];

export const EXPERIENCE_CONTEXT_OPTIONS = [
  { key: 'family_business', label: "Helped regularly with a family business or responsibilities" },
  { key: 'volunteered', label: "Volunteered (shop, charity, club, community event)" },
  { key: 'cared_for_family', label: "Looked after younger siblings/relatives regularly" },
  { key: 'organised_events', label: "Organised a club, team, event, or online group" },
  { key: 'tutored', label: "Tutored or helped others with school/college work" },
  { key: 'social_media', label: "Managed social media or content for myself or someone else" },
  { key: 'diy_repairs', label: "Done basic repairs or DIY (bikes, computers, cars, home etc.)" },
  { key: 'freelance', label: "Done freelance gigs (music, art, content, gaming, etc.)" },
  { key: 'informal_work', label: "Worked informally (cash-in-hand, helping out, etc.)" },
];

export const RELIABILITY_OPTIONS = [
  { key: 'stick_to_shifts', label: "I'm good at sticking to agreed shifts or times" },
  { key: 'early_mornings', label: "I'm okay with early morning starts" },
  { key: 'evening_shifts', label: "I'm okay with evening shifts" },
  { key: 'some_weekends', label: "I'm okay working some weekends" },
  { key: 'extra_shifts', label: "I'm happy to cover extra shifts occasionally if I can" },
  { key: 'plan_ahead', label: "I prefer to plan my week in advance" },
];

export const TIME_OF_DAY_OPTIONS = [
  { key: 'morning', label: "Morning person" },
  { key: 'afternoon', label: "Afternoon" },
  { key: 'evening', label: "Evening/Night owl" },
  { key: 'flexible', label: "Flexible - any time works" },
];

export const SECTOR_OPTIONS = [
  { key: 'hospitality', label: "Hospitality (cafés, bars, restaurants, hotels)" },
  { key: 'retail', label: "Retail (shops, supermarkets, customer service)" },
  { key: 'travel_tourism', label: "Travel & Tourism" },
  { key: 'engineering', label: "Engineering & Technical" },
  { key: 'construction', label: "Construction & Trades" },
  { key: 'warehousing', label: "Warehousing & Logistics" },
  { key: 'office_admin', label: "Office/Admin & Organising" },
  { key: 'tech_it', label: "Tech / IT Support / Software" },
  { key: 'creative_media', label: "Creative & Media (content, social, design, music)" },
  { key: 'care_support', label: "Care / Support Work" },
  { key: 'education', label: "Education / Tutoring / Youth Work" },
  { key: 'outdoor', label: "Outdoor / Landscaping / Environmental" },
  { key: 'driving_delivery', label: "Driving & Delivery" },
];

export const HOBBY_OPTIONS = [
  { key: 'team_sports', label: "Team sports (football, rugby, netball, etc.)" },
  { key: 'individual_sports', label: "Individual sports (running, swimming, gym, martial arts, etc.)" },
  { key: 'gaming', label: "Gaming & online communities" },
  { key: 'music', label: "Music (playing, producing, DJing)" },
  { key: 'art_design', label: "Art & design (drawing, painting, digital art)" },
  { key: 'content_creation', label: "Content creation (video, streaming, social media)" },
  { key: 'fixing_building', label: "Fixing or building things (DIY, cars, bikes, PCs)" },
  { key: 'reading_learning', label: "Reading / self-study (books, online courses, etc.)" },
  { key: 'outdoor_activities', label: "Outdoor activities (hiking, camping, etc.)" },
  { key: 'caring', label: "Caring responsibilities (family, neighbours, pets)" },
];

// Character limits
export const CHAR_LIMITS = {
  experience_context_other: 80,
  experience_proud_of: 120,
  next_chapter_sectors_other: 60,
  next_chapter_text: 200,
  hobby_other: 80,
  hobby_to_work_note: 120,
  show_and_tell_title: 40,
  show_and_tell_description: 80,
};

// Selection limits
export const MAX_WORK_STYLE_SELECTIONS = 4;
export const MAX_SHOW_AND_TELL_ITEMS = 3;
