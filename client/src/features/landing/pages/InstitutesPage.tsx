import React from 'react';
import { BookletViewer } from '../../../shared/components/BookletViewer';

export const InstitutesPage: React.FC = () => {
  return <BookletViewer title="Institute Challenges & Solutions" imageFolder="institutes" pageCount={20} />;
};
