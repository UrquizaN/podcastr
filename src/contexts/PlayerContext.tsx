import { createContext, ReactNode, useState } from "react";

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    play: (episode: Episode) => void;
    playList: (episode: Episode[], index: number) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    isPlaying: boolean;
}

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({children}: PlayerContextProviderProps){
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList (list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function playNext() {
        const nextEpisodeIndex = currentEpisodeIndex + 1;

        if(nextEpisodeIndex < episodeList.length) {
            setCurrentEpisodeIndex(nextEpisodeIndex);
        }
    }

    function playPrevious() {
        const previousEpisodeIndex = currentEpisodeIndex - 1;

        if(previousEpisodeIndex > 0) {
            setCurrentEpisodeIndex(previousEpisodeIndex);
        }
    }

    return (
        <PlayerContext.Provider 
            value={{ 
                episodeList, 
                currentEpisodeIndex, 
                play,
                playList,
                playNext,
                playPrevious, 
                isPlaying, 
                togglePlay, 
                setPlayingState 
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}