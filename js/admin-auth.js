import { supabase } from './supa.js';

export async function requireAdminLogin() {
    console.log("🔍 Starte Admin-Check...");

    // 1. Session prüfen
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("Session Data:", session);
    if (sessionError) console.error("Session Error:", sessionError);

    if (!session) {
        console.warn("❌ Keine aktive Session gefunden.");
        alert("Bitte zuerst einloggen.");
        window.location.href = "login.html";
        return;
    }

    // 2. User laden
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("User Data:", user);
    if (userError) console.error("User Error:", userError);

    if (!user) {
        console.warn("❌ Kein User gefunden.");
        window.location.href = "login.html";
        return;
    }

    // 3. Profile mit Rolle laden
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single();

    console.log("Profile Data:", profile);
    if (profileError) console.error("Profile Error:", profileError);

    if (!profile) {
        console.warn("❌ Kein Profile-Eintrag gefunden.");
        alert("Kein Zugriff – kein Profile-Eintrag.");
        window.location.href = "index.html";
        return;
    }

    if (profile.role !== "admin") {
        console.warn(`❌ Zugriff verweigert. Rolle ist '${profile.role}' statt 'admin'.`);
        alert("Kein Zugriff – Adminrechte erforderlich.");
        window.location.href = "index.html";
        return;
    }

    console.log("✅ Admin-Login erkannt:", user.email);

    // 4. Willkommensanzeige einfügen
    const welcomeContainer = document.getElementById("admin-welcome");
    if (welcomeContainer) {
        welcomeContainer.textContent = `Willkommen, ${profile.email} (Admin)`;
    }
}

// Optional: Logout-Funktion für Navigation
export async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "login.html";
}