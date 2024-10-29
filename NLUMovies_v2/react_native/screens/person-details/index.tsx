import {
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { type RouteProp, useRoute } from '@react-navigation/native';
import MovieList from '../../components/MovieList';
import Loading from '../../components/Loading';
import {
  fallbackPersonImage,
  fetchImage342,
} from '../../api/moviedb';
import type { PersonDetails } from '../../model/PersonDetails';
import { CastRepository } from '../../repositories/CastRepository';
import type { Movie } from '../../model/Movie';
import type { RootStackParamList } from '../navigation/navigation';
import { MovieRepository } from '../../repositories/MovieRepository';
import PersonAvatar from './PersonAvatar';
import PersonInfo from './PersonInfo';
import PersonDetailsHead from './PersonDetailsHead';
import PersonDetailsContainer from './PersonDetailsContainer';

var { width, height } = Dimensions.get('window');
export default function PersonScreen() {
  const { params: item } = useRoute<RouteProp<RootStackParamList, 'Person'>>();
  const [personMovies, setPersonMovies] = useState<Movie[]>([]);
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const castRepository = new CastRepository();
    const movieRepository = new MovieRepository();
    const loadPersonDetails = async function (personId: string) {
      const data = await castRepository.fetchPersonDetails(personId);
      setPerson(data);
    };
    const loadPersonMovies = async function (personId: string) {
      const data = await movieRepository.fetchMoviesOfPerson(personId);
      setPersonMovies(data);
    };
    const fetch = async () => {
      Promise.all([
        loadPersonDetails(item.id),
        loadPersonMovies(item.id),
      ]);
      setLoading(false);
    };
    fetch();
  }, [item]);
  return (
    <PersonDetailsContainer>
      <>
        <PersonDetailsHead/>
        {loading ? (
          <Loading />
        ) : (
          <>
            <PersonAvatar 
              avatarLink={fetchImage342(person?.profile_path) || fallbackPersonImage}
              height={height * 0.43}
              width={width * 0.74}
              className="flex-row justify-center mt-14"
            />
            <PersonInfo person={person}/>
            <MovieList title="Phim cùng diễn viên" movies={personMovies} />
          </>
        )}
      </>
    </PersonDetailsContainer>
  );
}
