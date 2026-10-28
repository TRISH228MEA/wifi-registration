const SUPABASE_URL =
  "https://lzstaejplwpbzsiynxyq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_JrLAzxM9Xdlg1TSRlM9unw_NwBS8tMh";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const form = document.getElementById("registrationForm");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("statusMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusMessage.textContent = "";
  statusMessage.className = "";

  const fullName = document
    .getElementById("fullName")
    .value
    .trim();

  const mobileNumber = document
    .getElementById("mobileNumber")
    .value
    .trim();

  if (fullName.length < 2 || fullName.length > 100) {
    showMessage("Please enter a valid full name.", "error");
    return;
  }

  if (!/^[0-9+\-() ]{7,20}$/.test(mobileNumber)) {
    showMessage("Please check your mobile number.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = "<span>Submitting...</span>";

  try {
    const { error } = await supabaseClient
      .from("registrations")
      .insert({
        full_name: fullName,
        mobile_number: mobileNumber,
        consent_given: true
      });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    form.reset();
    showMessage(
      "Registration submitted successfully. Thank you!",
      "success"
    );
  } catch (error) {
    console.error("Registration failed:", error);

    showMessage(
      "Unable to submit your registration. Please try again.",
      "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML =
      "<span>Submit Registration</span><span aria-hidden='true'>→</span>";
  }
});

function showMessage(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type;
}