import React, { useEffect, useState } from "react"
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { createThumbnail } from "react-native-create-thumbnail";
import { PlayCircleIcon } from "react-native-heroicons/outline";

type Episode = {
    name: string,
    url: string,
    thumbnail: string
}

function renderEpisode(episode: Episode) {
    return (
        <TouchableOpacity style={styles.episode}>
            <Image 
            source={{
                uri: `${episode.thumbnail}`
            }}
            style={styles.thumbImage}
            />
            <PlayCircleIcon 
                size={35} 
                strokeWidth={1.1}
                color={'white'}
            />
            <Text style={styles.episodeName}>Tập {episode.name}</Text>
        </TouchableOpacity>
    );
}

async function loadImage(videoLink: string) {
    try {
        const response = await createThumbnail({
            url: videoLink,
            timeStamp: 2000,
          });
        return response.path;
    } catch (error) {
        console.error(error)
    }
} 

function renderSeperator() {
    return <View style={{width: 15}}/>
}

export default function EpisodeList() {
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const [refreshing, setRefreshing] = useState(false); // State cho refreshing

    useEffect(() => {
        getData("refresh");
    }, []);
    
    async function getData(action: string) {
        switch (action) {
            case "refresh": {
                console.log('refresh')
                const epArr : Episode[] = [];
                const path = await loadImage('https://s5.phim1280.tv/20241028/cCmVbWnx/index.m3u8')
                console.log('path', path)
                for (let i = 0; i < 20; i++) {
                    epArr.push({
                        name: `${i}`, 
                        url: 'https://static.vecteezy.com/system/resources/thumbnails/024/646/930/small_2x/ai-generated-stray-cat-in-danger-background-animal-background-photo.jpg',
                        thumbnail: `${path}`
                    })
                }
                setEpisodes([...epArr])
                break;
            }
            case "load-more": {
                const size = episodes.length;
                const epArr = [... episodes]
                const path = await loadImage('https://vip.opstream11.com/share/d516b13671a4179d9b7b458a6ebdeb92')
                for (let i = size; i < size + 5; i++) {
                    epArr.push({
                        name: `${i}`, 
                        url: 'https://static.vecteezy.com/system/resources/thumbnails/024/646/930/small_2x/ai-generated-stray-cat-in-danger-background-animal-background-photo.jpg',
                        thumbnail: `${path}`
                    })
                }
                setEpisodes([...epArr])
                break;
            }
        }
    }
    

    return (
        <View>
            <Text className="font-semibold" 
            style={{
                fontSize: 20,
                color: 'white',
                fontWeight: 600
            }}>
                Tập phim
            </Text>
            <View>
                <FlatList style={styles.episodeList}
                    horizontal
                    ItemSeparatorComponent={renderSeperator}
                    data={episodes}
                    renderItem={({item} : {item: any}) => {
                        return renderEpisode(item)
                    }}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => getData("load-more")}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => getData('refresh')}
                        />
                    }
                    />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    episodeList: {
        display: 'flex',
        gap: 10,
        flexDirection: 'row',
    },
    episode: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 100,
        objectFit: "contain"
    },
    episodeName: {
        left: 15,
        bottom: 10,
        color: 'white',
        position: 'absolute'
    },
    thumbImage: {
        borderRadius: 15,
        width: '100%',
        height: '100%',
        position: 'absolute',
    }
})