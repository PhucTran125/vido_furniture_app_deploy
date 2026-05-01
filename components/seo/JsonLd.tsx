import React from 'react';

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export const JsonLd: React.FC<{ data: JsonLdData }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
