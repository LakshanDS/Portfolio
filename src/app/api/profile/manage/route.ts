import { NextResponse } from "next/server";
import { getProfile, updateProfile, getProfileStats, updateProfileStats } from "@/lib/data";

export async function GET() {
  try {
    const [profile, stats] = await Promise.all([
      getProfile(),
      getProfileStats()
    ]);
    
    return NextResponse.json({ profile, stats });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    let { profileId, statsId, profileData, statsData } = data;
    
    // If profileId is 'default' or missing, get the actual profile ID
    if (profileId === 'default' || !profileId) {
      const profile = await getProfile();
      if (profile) {
        profileId = profile.id;
      } else {
        return NextResponse.json(
          { error: "No profile found" },
          { status: 404 }
        );
      }
    }
    
    if (profileId && profileData) {
      await updateProfile(profileId, profileData);
    }
    
    if (statsId && statsData) {
      await updateProfileStats(statsId, statsData);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
