import React, { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from "react-native";
import Video, { type VideoRef } from "react-native-video"
import Orientation from "react-native-orientation-locker";
import SystemNavigationBar from "react-native-system-navigation-bar";
import type { Float } from "react-native/Libraries/Types/CodegenTypes";
import LottieView from "lottie-react-native";
import Slider from "@react-native-community/slider";

export default function ViewVideo() {

    type OnProgressData = Readonly<{
        currentTime: Float;
        playableDuration: Float;
        seekableDuration: Float;
    }>

    const [isPaused, setIsPaused] = useState<boolean>(true)
    const [videoPressed, setVideoPressed] = useState<boolean>(false)
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const [progress, setProgress] = useState<OnProgressData>()
    const [isBuffering, setIsBuffering] = useState<boolean>(true)
    const [resizeMode, setResizeMode] = useState<string>("contain")
    const videoRef = useRef<VideoRef>();

    useEffect(() => {
        Orientation.lockToLandscape();
    }, [])

    const handleVideoPressed = () => {
        setVideoPressed(!videoPressed)
    }

    const moveBackward = () => {

        progress?.currentTime && videoRef?.current?.seek(progress.currentTime - 10)
    }

    const moveForward = () => {
        progress?.currentTime && videoRef?.current?.seek(progress.currentTime + 10)
    }

    const playVideo = () => {
        setIsPaused(false)
    }

    const pauseVideo = () => {
        setIsPaused(true)
    }

    const handleMute = () => {
        setIsMuted(!isMuted)
    }

    const handleExpand = () => {
        setResizeMode('cover')
    }

    const handleCompress = () => {
        setResizeMode('contain')
    }

    const formatDuration = (durationInSeconds: number) => {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);

        const formatHours = hours > 0 ? `${hours}:` : '';
        const formatMinutes = `${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:`;
        const formatSeconds = `${seconds < 10 ? '0' : ''}${seconds}`;

        return `${formatHours}${formatMinutes}${formatSeconds}`;
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden/>
            <Video
            style={styles.backgroundVideo}
            source={{
                uri: 'https://vip.opstream14.com/20220619/14926_7dc9f0f7/index.m3u8',
            }}
            paused={isPaused}
            muted={isMuted}
            resizeMode={resizeMode as  "contain" | "none" | "stretch" | "cover" | undefined}
            onLoad={videoInfo => console.log("Video Info:", videoInfo)}
            onBuffer={(bufferValue) => {
                setIsBuffering(bufferValue.isBuffering)
            }}
            ref={videoRef as React.LegacyRef<VideoRef>}
            onProgress={progress => {
                setProgress(_ => progress)
            }}
            />
            <TouchableOpacity onPress={() => handleVideoPressed()} 
            style={[
                styles.videoScreenContainer, {
                    backgroundColor: videoPressed ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'
                }
            ]}>
                {
                    !isBuffering ? 
                    <View style={{opacity: videoPressed ? 1 : 0, flexDirection: 'row', alignItems: 'center', gap: 60}}>
                        <TouchableOpacity onPress={() => moveBackward()}>
                            <Image 
                            source={require('../../assets/backward-10-seconds.png')} 
                            style={{width: 50, height: 50}}/>
                        </TouchableOpacity>
                        {
                            isPaused ? (
                                <TouchableOpacity onPress={() => playVideo()}>
                                    <Image 
                                    source={require('../../assets/play.png')} 
                                    style={{width: 40, height: 40}}/>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => pauseVideo()}>
                                    <Image 
                                    source={require('../../assets/pause.png')} 
                                    style={{width: 40, height: 40}}/>
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity onPress={() => moveForward()}>
                            <Image 
                            source={require('../../assets/forward-10-seconds.png')} 
                            style={{width: 50, height: 50}}/>
                        </TouchableOpacity>
                    </View> 
                    : (
                        <LottieView style={{width: 50, height: 50}} 
                        source={require('../../assets/loading.json')}
                        autoPlay loop/>
                    )
                }
                <View style={[styles.sliderContainer, {opacity: videoPressed ? 1 : 0}]}>
                    <Text style={styles.sliderText}>{formatDuration(progress?.currentTime as number)}</Text>
                    <Slider
                    style={styles.sliderProgressBar}
                    onSlidingComplete={(progress) => {
                        videoRef.current?.seek(progress)
                    }}
                    minimumValue={0}
                    maximumValue={progress?.seekableDuration}
                    minimumTrackTintColor="green"
                    maximumTrackTintColor="white"
                    thumbTintColor="#28b463"
                    value={progress?.currentTime}
                    />
                    <Text style={styles.sliderText}>{formatDuration(progress?.seekableDuration as number)}</Text>
                </View>
                {
                    !isBuffering && (
                        <View style={[styles.audioSubsIconContainer, {opacity: videoPressed ? 1 : 0}]}>
                            {
                                isMuted ? (
                                    <TouchableOpacity onPress={handleMute}>
                                        <Image 
                                        source={require('../../assets/mute.png')} 
                                        style={{width: 30, height: 30}}/>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={handleMute}>
                                        <Image 
                                        source={require('../../assets/audio.png')} 
                                        style={{width: 30, height: 30}}/>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    )
                }
                {
                    !isBuffering && (
                        <View style={[styles.resolutionIconContainer, {opacity: videoPressed ? 1 : 0}]}>
                            {
                                resizeMode === 'cover' ? (
                                    <TouchableOpacity onPress={handleCompress}>
                                        <Image 
                                        source={require('../../assets/compress.png')} 
                                        style={{width: 40, height: 40}}/>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={handleExpand}>
                                        <Image 
                                        source={require('../../assets/expand.png')} 
                                        style={{width: 40, height: 40}}/>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    )
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        width: '100%'
    },
    backgroundVideo: {
        width: '100%',
        height: '100%'
    },
    videoScreenContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',

    },
    sliderContainer: {
        width: '90%',
        height: '25%',
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sliderProgressBar: {
        flex: 1,
        color: 'red',
        bottom: 40
    },
    sliderText: {
        color: 'white',
        bottom: 40
    },
    audioSubsIconContainer: {
        position: 'absolute',
        bottom: 30,
        left: 65
    },
    resolutionIconContainer: {
        position: 'absolute',
        bottom: 30,
        right: 65
    }
})