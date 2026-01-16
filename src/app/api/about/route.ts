import { NextResponse } from 'next/server'
import { getProfileStats, getAllSkills, getEducation, getExperience, getAboutCards, getProfile, getProfileStatus } from '@/lib/data'

export async function GET() {
  try {
    const [statsData, skillsData, educationData, experienceData, aboutCardsData, profileData, profileStatusData] = await Promise.all([
      getProfileStats(),
      getAllSkills(),
      getEducation(),
      getExperience(),
      getAboutCards(),
      getProfile(),
      getProfileStatus()
    ])

    const mergedProfile = profileData ? {
      ...profileData,
      isOpenToWork: profileStatusData?.isOpenToWork ?? false
    } : null;

    return NextResponse.json({
      stats: statsData,
      skills: skillsData,
      education: educationData,
      experience: experienceData,
      aboutCards: aboutCardsData,
      profile: mergedProfile
    })
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json({
      stats: null,
      skills: [],
      education: [],
      experience: [],
      aboutCards: [],
      profile: null
    })
  }
}
