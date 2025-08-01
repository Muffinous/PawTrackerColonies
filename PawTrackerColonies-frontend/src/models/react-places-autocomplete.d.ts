// src/types/react-places-autocomplete.d.ts
declare module 'react-places-autocomplete' {
    import { ComponentType, ReactNode } from 'react';
  
    export interface Suggestion {
      description: string;
      placeId: string;
    }
  
    export interface PlacesAutocompleteProps {
      value: string;
      onChange: (value: string) => void;
      onSelect: (value: string) => void;
      children: ({
        getInputProps,
        suggestions,
        getSuggestionItemProps
      }: {
        getInputProps: any;
        suggestions: any;
        getSuggestionItemProps: any;
      }) => ReactNode;
    }
  
    const PlacesAutocomplete: ComponentType<PlacesAutocompleteProps>;
  
    export default PlacesAutocomplete;
  }
  