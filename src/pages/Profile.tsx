import ProfileForm from "../components/Authentication/ProfileForm";
import { SiteLanguage } from "../i18n/siteLanguage";

const Profile = ({ language }: { language: SiteLanguage }) => {
  return <ProfileForm language={language} />;
};

export default Profile;
