import React from "react";

export interface IReactHelmet {
  title: string;
  description: string;
  link: string;
  keywords: string;
  imageCard: string;
  noIndex: boolean;
  addPostFixTitle: boolean;
  children: React.ReactNode;
}
