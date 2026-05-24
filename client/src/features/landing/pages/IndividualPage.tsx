import React from 'react';
import { BookletViewer } from '../../../shared/components/BookletViewer';

export const IndividualPage: React.FC = () => {
  return <BookletViewer title="Individual Challenges & Solutions" imageFolder="individuals" pageCount={12} />;
};
