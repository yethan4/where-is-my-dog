import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { BREED_OPTIONS } from '@/constants/dogOptions'

interface SingleProps {
  mode: 'single'
  value: string
  onChange: (value: string) => void
}

interface MultiProps {
  mode: 'multi'
  value: string[]
  onChange: (value: string[]) => void
}

type BreedPickerProps = SingleProps | MultiProps

const BreedPicker = (props: BreedPickerProps) => {
  const [multiSearch, setMultiSearch] = useState('')

  const searchText = props.mode === 'single' ? props.value : multiSearch

  const isActive = (opt: string) =>
    props.mode === 'single' ? props.value === opt : props.value.includes(opt)

  const filtered = (searchText.length > 0
    ? BREED_OPTIONS.filter(b => b.toLowerCase().includes(searchText.toLowerCase()))
    : BREED_OPTIONS
  ).slice().sort((a, b) => Number(isActive(b)) - Number(isActive(a)))

  const handleSelect = (opt: string) => {
    if (props.mode === 'single') {
      props.onChange(opt)
    } else {
      const current = props.value
      props.onChange(
        current.includes(opt) ? current.filter(v => v !== opt) : [...current, opt]
      )
    }
  }

  const handleTextChange = (text: string) => {
    if (props.mode === 'single') {
      props.onChange(text)
    } else {
      setMultiSearch(text)
    }
  }

  const handleClear = () => {
    if (props.mode === 'single') {
      props.onChange('')
    } else {
      setMultiSearch('')
    }
  }

  return (
    <View>
      <View className="flex-row items-center border-2 border-gray-200 rounded-xl px-3 mb-3">
        <FontAwesome5 name="search" size={14} color="#9ca3af" />
        <TextInput
          className="flex-1 py-3 px-2 text-gray-800"
          placeholder="Search or type breed..."
          value={searchText}
          onChangeText={handleTextChange}
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={8} className="active:opacity-80">
            <FontAwesome5 name="times" size={14} color="#9ca3af" />
          </Pressable>
        )}
      </View>

      <View className="flex-row flex-wrap gap-2">
        {filtered.map(opt => {
          const active = isActive(opt)
          return (
            <Pressable
              key={opt}
              onPress={() => handleSelect(opt)}
              className={`px-3.5 py-2.5 rounded-full border-2 active:opacity-80 ${
                active ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-100'
              }`}
            >
              <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>
                {opt}
              </Text>
            </Pressable>
          )
        })}
        {filtered.length === 0 && props.mode === 'single' && (
          <Text className="text-gray-400 text-sm py-2">
            No matching breeds — the typed name will be saved
          </Text>
        )}
      </View>
    </View>
  )
}

export default BreedPicker
