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
    togglePlay: () => void;
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

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    return (
        <PlayerContext.Provider 
            value={{ 
                episodeList, 
                currentEpisodeIndex, 
                play, 
                isPlaying, 
                togglePlay, 
                setPlayingState 
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}