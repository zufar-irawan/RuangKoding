import { createClient } from "./supabase/client";

export const GetUserProps = async (id: string) => {
  const supabase = createClient();

  const userProfile = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const userLink = await supabase
    .from("user_links")
    .select("*")
    .eq("user_id", id);

  const userExperience = await supabase
    .from("user_experience")
    .select("*")
    .eq("user_id", id);

  const userSkills = await supabase
    .from("user_skills")
    .select("*")
    .eq("user_id", id);

  return { userLink, userExperience, userSkills, userProfile };
};

// ============ PROFILE UPDATE ============
export const updateProfile = async (
  userId: string,
  data: {
    firstname: string;
    lastname: string | null;
    motto: string | null;
    bio: string | null;
  },
) => {
  const supabase = createClient();

  const fullname = data.lastname
    ? `${data.firstname} ${data.lastname}`
    : data.firstname;

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({
      firstname: data.firstname,
      lastname: data.lastname,
      fullname: fullname,
      motto: data.motto,
      bio: data.bio,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return updatedProfile;
};

// ============ USER SKILLS ============
export const createUserSkill = async (
  userId: string,
  skillName: string,
  level: string,
) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_skills")
    .insert({
      user_id: userId,
      skill_name: skillName,
      level: level,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserSkill = async (
  userId: string,
  oldSkillName: string,
  newSkillName: string,
  level: string,
) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_skills")
    .update({
      skill_name: newSkillName,
      level: level,
    })
    .eq("user_id", userId)
    .eq("skill_name", oldSkillName)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteUserSkill = async (userId: string, skillName: string) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_skills")
    .delete()
    .eq("user_id", userId)
    .eq("skill_name", skillName);

  if (error) throw error;
};

// ============ USER EXPERIENCE ============
export const createUserExperience = async (data: {
  userId: string;
  organizationName: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}) => {
  const supabase = createClient();

  const { data: newExperience, error } = await supabase
    .from("user_experience")
    .insert({
      user_id: data.userId,
      organization_name: data.organizationName,
      role: data.role,
      start_date: data.startDate,
      end_date: data.endDate,
      description: data.description,
    })
    .select()
    .single();

  if (error) throw error;
  return newExperience;
};

export const updateUserExperience = async (
  createdAt: string,
  data: {
    organizationName: string;
    role: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
  },
) => {
  const supabase = createClient();

  const { data: updatedExperience, error } = await supabase
    .from("user_experience")
    .update({
      organization_name: data.organizationName,
      role: data.role,
      start_date: data.startDate,
      end_date: data.endDate,
      description: data.description,
    })
    .eq("created_at", createdAt)
    .select()
    .single();

  if (error) throw error;
  return updatedExperience;
};

export const deleteUserExperience = async (createdAt: string) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_experience")
    .delete()
    .eq("created_at", createdAt);

  if (error) throw error;
};

// ============ USER LINKS ============
export const createUserLink = async (
  userId: string,
  platform: string | null,
  url: string,
) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_links")
    .insert({
      user_id: userId,
      platform: platform,
      url: url,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserLink = async (
  createdAt: string,
  platform: string | null,
  url: string,
) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_links")
    .update({
      platform: platform,
      url: url,
    })
    .eq("created_at", createdAt)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteUserLink = async (createdAt: string) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_links")
    .delete()
    .eq("created_at", createdAt);

  if (error) throw error;
};
