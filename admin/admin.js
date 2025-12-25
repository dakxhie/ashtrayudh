import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY"
);

const statusEl = document.getElementById("admin-status");

async function checkAdmin() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    statusEl.textContent = "Not logged in. Access denied.";
    return;
  }

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data || data.role !== "admin") {
    statusEl.textContent = "You are not an admin. Access denied.";
    return;
  }

  statusEl.textContent = "Admin verified. Access granted.";
}

checkAdmin();
