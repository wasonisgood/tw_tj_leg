import { Navigate, useParams } from 'react-router-dom';

export default function YearRedirect() {
  const { year } = useParams<{ year: string }>();
  if (!year) return <Navigate to="/" replace />;
  return <Navigate to={`/${year}/guide`} replace />;
}
