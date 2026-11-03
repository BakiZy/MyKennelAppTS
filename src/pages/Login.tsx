import LoginForm from "../components/Authentication/LoginForm";
import { SiteLanguage } from "../i18n/siteLanguage";

const LoginPage = ({ language }: { language: SiteLanguage }) => {
  return <LoginForm language={language} />;
};

export default LoginPage;
