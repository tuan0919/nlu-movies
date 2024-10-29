import { View, Text } from "react-native"
import React from "react"
import type { PersonDetails } from "../../model/PersonDetails"
import { translate } from "../../theme"

type PersonInfoProps = {
    person: PersonDetails | null
}
export default function PersonInfo({person}: PersonInfoProps) {
    return (
     <View>
        <View className="mt-6">
            <Text className="text-3xl text-white font-bold text-center">
              {person?.name}
            </Text>
            <Text className="text-base text-neutral-500 font-bold text-center">
              {person?.place_of_birth}
            </Text>
          </View>
          <View className="mx-3 mt-6 p-4 flex-row justify-between items-center bg-neutral-700 rounded-full">
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Giới tính</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.gender === 1 ? 'Nữ' : 'Nam'}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Ngày sinh</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.birthday}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Được biết đến</Text>
              <Text className="text-neutral-300 text-sm">
                {translate[person?.known_for_department as keyof typeof translate ] ?? 'Không rõ' }
              </Text>
            </View>
            <View className="px-2 items-center">
              <Text className="text-white font-semibold">Nổi tiếng</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.popularity?.toFixed(2)} %
              </Text>
            </View>
          </View>
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg">Tiểu sử</Text>
            <Text className="text-neutral-400 tracking-wide">
              {person?.biography || 'Chưa có tiểu sử về người này'}
            </Text>
        </View>
     </View>   
    )
}