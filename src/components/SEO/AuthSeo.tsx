import Seo from "./Seo";
import { accountPath, SiteLanguage } from "../../i18n/siteLanguage";

type AuthPage = "login" | "profile" | "forgot-password" | "reset-password" | "confirm-email" | "resend-confirmation";

const titles: Record<AuthPage, { en: string; sr: string }> = {
  login: { en: "Login or create an account", sr: "Prijava ili registracija" },
  profile: { en: "Your profile", sr: "Vaš profil" },
  "forgot-password": { en: "Forgot password", sr: "Zaboravljena lozinka" },
  "reset-password": { en: "Reset password", sr: "Promena lozinke" },
  "confirm-email": { en: "Confirm email", sr: "Potvrda e-pošte" },
  "resend-confirmation": { en: "Resend confirmation email", sr: "Ponovno slanje potvrde e-pošte" },
};

const AuthSeo = ({ language, page }: { language: SiteLanguage; page: AuthPage }) => (
  <Seo
    title={`${titles[page][language]} | Von Apalusso`}
    description={language === "sr" ? "Korisnički nalog odgajivačnice Von Apalusso." : "Von Apalusso kennel account."}
    canonical={`https://poodlesvonapalusso.com${accountPath(language, page)}`}
    robots="noindex,follow"
    lang={language}
  />
);

export default AuthSeo;
