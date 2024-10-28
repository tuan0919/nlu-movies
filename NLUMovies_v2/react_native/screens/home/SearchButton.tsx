import React from 'react';
import { TouchableOpacity, type GestureResponderEvent } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';

type SearchButtonProps = {
    onPressSearch: (event: GestureResponderEvent) => void | undefined;
}

export default function SearchButton({onPressSearch} : SearchButtonProps) {
    return (
        <TouchableOpacity onPress={onPressSearch}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
        </TouchableOpacity>
    );
}
