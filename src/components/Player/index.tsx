import { PlayerContext } from '../../contexts/PlayerContext';

import { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';

export function Player () {
    const audioRef = useRef<HTMLAudioElement>(null)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        playNext,
        playPrevious,
        togglePlay, 
        setPlayingState,
        hasNext,
        hasPrevious
    } = useContext(PlayerContext);

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
                    <span>00:00</span>
                    
                    { episode ? (
                        <Slider 
                            trackStyle={{ backgroundColor: '#04d361'}}
                            railStyle={{ backgroundColor: '#9f75ff'}}
                            handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                        />
                    ) : (
                        <div className={styles.slider}>
                            <div className={styles.emptySlider} />
                        </div>
                    ) }

                    <span>00:00</span>
                </div>

                { episode && 
                    <audio 
                        autoPlay 
                        src={episode.url} 
                        ref={audioRef} 
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                }

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
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
                    <button type="button" disabled={!episode }>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}