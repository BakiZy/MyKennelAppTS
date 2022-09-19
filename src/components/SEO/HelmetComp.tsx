import { IReactHelmet } from "../../interfaces/IReactHelmet";
import { Helmet } from "react-helmet";

const domainUrl = "https://poodlesvonapalusso.xyz";
const host = new URL(domainUrl).hostname;
const HelmetComp = (props: IReactHelmet) => {
  return (
    <>
      <TitleMetaTags {...props} />
      <DescriptionMetaTags {...props} />
    </>
  );
};

const TitleMetaTags = ({ title }: IReactHelmet) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="title" content={title} />
      <meta property="og:title" content={host} />
    </Helmet>
  );
};

const DescriptionMetaTags = ({ description }: IReactHelmet) => {
  return (
    <Helmet>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
};

export default HelmetComp;
