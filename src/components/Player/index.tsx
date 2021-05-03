import { usePlayer } from '../../contexts/PlayerContext';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import { ConvertTimeToString } from '../../utils/convertTimeToString';

export function Player () {
    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState (0)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        playNext,
        playPrevious,
        togglePlay, 
        toggleLoop, 
        toggleShuffle, 
        setPlayingState,
        hasNext,
        hasPrevious,
        clearPlayerState
    } = usePlayer();

    useEffect(() =>{
        if(!audioRef.current){
            return;
        } 
        
        if(isPlaying){
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handdleSlider(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(Math.floor(amount));
    }

    function handleEpisodesEnded (){
        if(hasNext){
            playNext();
        } else {
            clearPlayerState();
        }
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>            
            
            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        src={episode.thumbnail}
                        width={520}
                        height={520}
                        objectFit="cover"
                        objectPosition="left"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{ConvertTimeToString(Math.floor(progress))}</span>
                    
                    { episode ? (
                        <Slider 
                            trackStyle={{ backgroundColor: '#04d361'}}
                            railStyle={{ backgroundColor: '#9f75ff'}}
                            handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                            value={progress}
                            max={episode.duration}
                            onChange={handdleSlider}
                        />
                    ) : (
                        <div className={styles.slider}>
                            <div className={styles.emptySlider} />
                        </div>
                    ) }

                    <span>{ConvertTimeToString(episode?.duration ?? 0)}</span>
                </div>

                { episode && 
                    <audio 
                        autoPlay 
                        src={episode.url} 
                        ref={audioRef} 
                        loop={isLooping}
                        onEnded={handleEpisodesEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                }

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        onClick={toggleShuffle} 
                        className={ isShuffling ? styles.isActive : '' }  
                        disabled={!episode || episodeList.length === 1}
                    >
                        <img src="/shuffle.svg" alt="Aleatório"/>
                    </button>
                    <button type="button" onClick={playPrevious}  disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay} >
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Pausar"/>
                        ) : (
                            <img src="/play.svg" alt="Tocar"/>
                        )}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button 
                        type="button" 
                        onClick={toggleLoop} 
                        className={ isLooping ? styles.isActive : '' } 
                        disabled={!episode }
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}