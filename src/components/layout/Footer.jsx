import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';

const Copyright = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Footer = () => {
  const { t } = useTranslation();
  return (
      <Copyright>
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </Copyright>
  );
};

export default Footer;