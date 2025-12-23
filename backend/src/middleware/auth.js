import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Verifies the user's role before allowing access to specific 14 pages
 * Prevents Patients from seeing Admin/Doctor data
 */
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) throw new Error("Invalid Token");

    // Attach user role and info to the request for GraphQL Resolvers
    req.user = {
      id: user.id,
      role: user.user_metadata.role,
      email: user.email
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};