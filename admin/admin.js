import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://rdfkcxzmleoodahnxgst.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZmtjeHptbGVvb2RhaG54Z3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjcyOTksImV4cCI6MjA3ODQwMzI5OX0.SXsMOMRUZ8OvCLOt-rBcfNEYo-flHUb6-_3_aC4veOY"
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
