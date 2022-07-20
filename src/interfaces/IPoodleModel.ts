import React from "react";

export interface PoodleModel {
  id: number;
  name: string;
  dateOfBirth: Date;
  geneticTests: boolean;
  pedigreeNumber: string;
  poodleSizeName: string;
  poodleColorName: string;
  image: string;
  children?: React.ReactNode | React.PropsWithChildren;
}

export interface PoodleSize {
  id: number;
  name: string;
}

export interface PoodleColor {
  id: number;
  name: string;
}

export interface PoodleSizeAndColorProp {
  poodleSize: PoodleSize[];
  poodleColor: PoodleColor[];
}

export interface PoodleActions {
  onClick(): void;
  onRemove(id: number): void;
}

export interface ChildrenProp {
  children: React.ReactNode;
}

export interface PoodleListProps {
  poodles: PoodleModel[];
  onRemove: (id: number) => void;
}
