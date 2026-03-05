import { View, Text, ScrollView, Pressable, TextInput, Switch } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import BreedPicker from "@/components/BreedPicker"
import { COLOR_OPTIONS } from "@/constants/dogOptions"

const DogDetailsStep = () => {
  const [breedActive, setBreedActive] = useState<boolean>(false);
  const [breed, setBreed] = useState<string>("");
  const [sizeActive, setSizeActive] = useState<boolean>(false);
  const [size, setSize] = useState<string>("");
  const [colorActive, setColorActive] = useState<boolean>(true);
  const [colors, setColors] = useState<string[]>([]);
  const [genderActive, setGenderActive] = useState<boolean>(false);
  const [gender, setGender] = useState<string>("");
  const [extrasActive, setExtrasActive] = useState<boolean>(false);
  const [dogName, setDogName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [specialMarks, setSpecialMarks] = useState<string>("");
  const [microchip, setMicrochip] = useState<boolean>(false);
  const [hasCollar, setHasCollar] = useState<boolean>(false);
  const [collarColor, setCollarColor] = useState<string>("");

  const toggleColor = (val: string) =>
    setColors(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 400 }}
    >
      <View className="bg-white px-4 pt-4 pb-2 mb-4 flex w-full rounded-xl">
        <Pressable
            onPress={() => setBreedActive(!breedActive)}
          >
          <View className="flex-row items-center relative mb-4">
            <FontAwesome5 name="dog" size={16} color="brown" className="bg-yellow-100 px-2 py-2 rounded-xl" />
            <Text className="ml-2 font-semibold text-gray-800">Breed</Text>
            {breed.length > 0 && (
              <Text className="ml-2 text-sm text-blue-600 font-medium">{breed}</Text>
            )}
            
              <FontAwesome5 name={breedActive ? "angle-up" : "angle-down"} size={16} className="absolute right-2" />
          </View>
        </Pressable>

        {breedActive && (
          <View className="mb-2">
            <BreedPicker mode="single" value={breed} onChange={setBreed} />
          </View>
        )}
      </View>

      <View className="bg-white px-4 pt-4 pb-2 mb-4 flex w-full rounded-xl">
        <Pressable
            onPress={() => setSizeActive(!sizeActive)}
        >
          <View className="flex-row items-center relative mb-4">
            <MaterialCommunityIcons name="ruler" size={16} color="brown" className="bg-yellow-100 px-2 py-2 rounded-xl" />
            <Text className="ml-2 font-semibold text-gray-800">Size</Text>
            {!!size && (
              <Text className="ml-2 text-sm text-blue-600 font-medium">{size}</Text>
            )}
            <FontAwesome5 name={sizeActive ? "angle-up" : "angle-down"} size={16} className="absolute right-2" />
          </View>
        </Pressable>

        {sizeActive && (
          <View className="flex-row gap-4 justify-center">
            {([
              { value: 'small', emoji: '🐶', label: 'Small', sub: '<10kg' },
              { value: 'medium', emoji: '🐕', label: 'Medium', sub: '10-25kg' },
              { value: 'large', emoji: '🦮', label: 'Large', sub: '25kg+' },
            ] as const).map(opt => {
              const active = size === opt.value
              return (
                <Pressable
                  key={opt.value}
                  className={`h-32 w-28 items-center justify-center border-2 rounded-xl ${active ? 'border-gray-400' : 'border-gray-200'}`}
                  onPress={() => setSize(opt.value)}
                >
                  <Text className="text-3xl mb-1">{opt.emoji}</Text>
                  <Text className={`font-semibold mb-1 ${active ? 'text-gray-800' : 'text-gray-500'}`}>{opt.label}</Text>
                  <Text className={`text-xs font-semibold ${active ? 'text-gray-600' : 'text-gray-400'}`}>{opt.sub}</Text>
                </Pressable>
              )
            })}
          </View>
        )}
      </View>

      <View className="bg-white px-4 pt-4 pb-2 mb-4 flex w-full rounded-xl">
        <Pressable
            onPress={() => setColorActive(!colorActive)}
        >
          <View className="flex-row items-center relative mb-4">
            <Ionicons name="color-palette-sharp" size={16} color="brown" className="bg-yellow-100 px-2 py-2 rounded-xl" />
            <Text className="ml-2 font-semibold text-gray-800">Color</Text>
            {colors.length > 0 && (
              <Text className="ml-2 text-sm text-blue-600 font-medium">
                {colors.map(c => COLOR_OPTIONS.find(o => o.value === c)?.label).join(', ')}
              </Text>
            )}
            <FontAwesome5 name={colorActive ? "angle-up" : "angle-down"} size={16} className="absolute right-2" />
          </View>
        </Pressable>

        {colorActive && (
          <View className="flex-row flex-wrap gap-2 mb-2">
            {COLOR_OPTIONS.map(opt => {
              const active = colors.includes(opt.value)
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => toggleColor(opt.value)}
                  className={`flex-row items-center px-3.5 py-2.5 rounded-full border-2 ${
                    active ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-100'
                  }`}
                >
                  {opt.dot ? (
                    <View
                      className="w-3 h-3 rounded-full mr-1.5"
                      style={{
                        backgroundColor: opt.dot,
                        borderWidth: 'border' in opt ? 1 : 0,
                        borderColor: '#d1d5db',
                      }}
                    />
                  ) : (
                    <View className="w-3 h-3 rounded-full mr-1.5 overflow-hidden flex-row">
                      <View className="flex-1 bg-[#7c4a1e]" />
                      <View className="flex-1 bg-[#f0f0f0]" />
                      <View className="flex-1 bg-[#1a1a1a]" />
                    </View>
                  )}
                  <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>
                    {opt.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        )}
      </View>

      <View className="bg-white px-4 pt-4 pb-2 mb-4 flex w-full rounded-xl">
        <Pressable onPress={() => setGenderActive(!genderActive)}>
          <View className="flex-row items-center relative mb-4">
            <Ionicons name="male-female" size={16} color="brown" className="bg-yellow-100 px-2 py-2 rounded-xl" />
            <Text className="ml-2 font-semibold text-gray-800">Gender</Text>
            {!!gender && (
              <Text className="ml-2 text-sm text-blue-600 font-medium capitalize">{gender}</Text>
            )}
            <FontAwesome5 name={genderActive ? "angle-up" : "angle-down"} size={16} className="absolute right-2" />
          </View>
        </Pressable>

        {genderActive && (
          <View className="flex-row gap-4 justify-center mb-2">
            {([
              { value: 'male', icon: 'male', label: 'Male', color: '#60a5fa' },
              { value: 'female', icon: 'female', label: 'Female', color: '#f472b6' },
              { value: 'unknown', icon: 'help-circle-outline', label: 'Unknown', color: '#9ca3af' },
            ] as const).map(opt => {
              const active = gender === opt.value
              return (
                <Pressable
                  key={opt.value}
                  className={`h-24 w-28 items-center justify-center border-2 rounded-xl ${active ? 'border-gray-400' : 'border-gray-200'}`}
                  onPress={() => setGender(opt.value)}
                >
                  <View className="mb-1">
                    <Ionicons name={opt.icon} size={32} color={active ? opt.color : '#9ca3af'} />
                  </View>
                  <Text className={`font-semibold ${active ? 'text-gray-800' : 'text-gray-500'}`}>{opt.label}</Text>
                </Pressable>
              )
            })}
          </View>
        )}
      </View>

      <View className="bg-white px-4 pt-4 pb-2 mb-4 flex w-full rounded-xl">
        <Pressable onPress={() => setExtrasActive(!extrasActive)}>
          <View className="flex-row items-center relative mb-4">
            <Ionicons name="information-circle-outline" size={16} color="brown" className="bg-yellow-100 px-2 py-2 rounded-xl" />
            <Text className="ml-2 font-semibold text-gray-800">Extras</Text>
            <FontAwesome5 name={extrasActive ? "angle-up" : "angle-down"} size={16} className="absolute right-2" />
          </View>
        </Pressable>

        {extrasActive && (
          <View className="mb-2 gap-4">
            <View>
              <Text className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Dog name</Text>
              <TextInput
                value={dogName}
                onChangeText={setDogName}
                placeholder="e.g. Buddy"
                placeholderTextColor="#9ca3af"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Age</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['puppy', 'young', 'adult', 'senior'] as const).map(opt => (
                  <Pressable
                    key={opt}
                    onPress={() => setAge(age === opt ? '' : opt)}
                    className={`px-4 py-2 rounded-full border-2 ${age === opt ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-100'}`}
                  >
                    <Text className={`font-semibold capitalize text-sm ${age === opt ? 'text-white' : 'text-gray-600'}`}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Special marks</Text>
              <TextInput
                value={specialMarks}
                onChangeText={setSpecialMarks}
                placeholder="e.g. scar on left ear, blue eyes"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={2}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="integrated-circuit-chip" size={18} color="#6366f1" />
                <Text className="font-semibold text-gray-800">Microchip</Text>
              </View>
              <Switch value={microchip} onValueChange={setMicrochip} />
            </View>

            <View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="dog-service" size={18} color="#6366f1" />
                  <Text className="font-semibold text-gray-800">Collar</Text>
                </View>
                <Switch value={hasCollar} onValueChange={setHasCollar} />
              </View>
              {hasCollar && (
                <TextInput
                  value={collarColor}
                  onChangeText={setCollarColor}
                  placeholder="Collar color / description"
                  placeholderTextColor="#9ca3af"
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 mt-2"
                />
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default DogDetailsStep
