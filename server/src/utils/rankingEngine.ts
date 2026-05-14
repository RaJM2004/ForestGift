import User from '../models/User';

/**
 * Global Ranking Engine for ForestGift
 * Calculates impact scores for all users and updates their global rank field.
 * Formula: (Trees * 100) + (Referrals * 250) + (Impact Points)
 */
export const syncGlobalRanks = async () => {
  try {
    console.log('--- Starting Global Ranking Sync ---');
    
    // 1. Fetch all users
    const allUsers = await User.find();
    
    // 2. Calculate scores for all users
    const userScores = allUsers.map(user => {
      const treeScore = (user.trees || 0) * 100;
      const referralScore = (user.referralCount || 0) * 250;
      const pointsScore = user.impactPoints || 0;
      
      const totalScore = treeScore + referralScore + pointsScore;
      
      return {
        _id: user._id,
        id: user.id,
        score: totalScore
      };
    });
    
    // 3. Sort by score descending
    userScores.sort((a, b) => b.score - a.score);
    
    // 4. Update each user with their rank
    const updatePromises = userScores.map((u, index) => {
      return User.findByIdAndUpdate(u._id, { 
        globalRank: index + 1 
      });
    });
    
    await Promise.all(updatePromises);
    
    console.log(`--- Ranking Sync Complete: ${userScores.length} users ranked ---`);
    return userScores.length;
  } catch (error) {
    console.error('CRITICAL: Global Ranking Sync Failed:', error);
    throw error;
  }
};
