import React, { useEffect, useState } from "react"
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { PlayCircleIcon } from "react-native-heroicons/outline";
import type { FilmDetails } from "../../model/apii.online/MovieDetails";
import type { Season } from "../../model/moviedb/TVSeriesSeason";
import { fetchImage500 } from "../../api/moviedb";

type Episode = {
    name: string,
    slug: string,
    filename: string,
    link_embed: string,
    link_m3u8: string,
    ep_name: string,
    thumbnail: string,
}

type EpisodeListProps = {
    filmDetails: FilmDetails,
    season: Season
}

function renderEpisode(episode: Episode, thumbnail: string) {
    return (
        <TouchableOpacity style={styles.episode}>
            <Image 
            source={{
                uri: `${thumbnail}`
            }}
            style={styles.thumbImage}
            />
            <View style={{position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderColor: 'rgb(233,233,233)',
                borderWidth: 2,
            }}/>
            <PlayCircleIcon 
                size={35} 
                strokeWidth={1.1}
                color={'white'}
            />
            <Text style={styles.episodeName}>Tập {episode.name}</Text>
        </TouchableOpacity>
    );
}

function renderSeperator() {
    return <View style={{width: 15}}/>
}

export default function EpisodeList({filmDetails, season} : EpisodeListProps) {
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
                for (let i = 0; i < 5; i++) {
                    epArr.push({...filmDetails.episodes[0].server_data[i],
                        thumbnail: fetchImage500(season.episodes[i].still_path),
                        name: season.episodes[i].episode_number,
                        ep_name: season.episodes[i].name
                    })
                }
                setEpisodes([...epArr])
                break;
            }
            case "load-more": {
                const size = episodes.length;
                const epArr = [... episodes]
                for (let i = size; i < size + 5; i++) {
                    epArr.push({...filmDetails.episodes[0].server_data[i],
                        thumbnail: fetchImage500(season.episodes[i].still_path),
                        name: season.episodes[i].episode_number,
                        ep_name: season.episodes[i].name
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
                Mùa {season.season_number}
            </Text>
            <View>
                <FlatList style={styles.episodeList}
                    horizontal
                    ItemSeparatorComponent={renderSeperator}
                    data={episodes}
                    renderItem={({item} : {item: any}) => {
                        return renderEpisode(item, item.thumbnail)
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