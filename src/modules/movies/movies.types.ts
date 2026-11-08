import type { Paginated } from "../../common/schemas/common.dto.js";
import type { CreateMovieInput } from "./dto/create-movie.dto.js";
import type { ListMoviesQuery } from "./dto/list-movies.query.dto.js";
import type { MovieResponse } from "./dto/movie.response.dto.js";
import type { SearchMoviesQuery } from "./dto/search-movies.query.dto.js";

export type Movie = MovieResponse;

export interface MoviesRepository {
  findMany(query: ListMoviesQuery): Promise<{ data: Movie[]; total: number }>;
  findById(id: string): Promise<Movie | null>;
  create(input: CreateMovieInput): Promise<Movie>;
}

/** Search index for movies. Postgres stays the source of truth. */
export interface MoviesSearch {
  ensureIndex(): Promise<void>;
  /** Never throws: indexing problems are logged, they must not fail the write. */
  index(movie: Movie): Promise<void>;
  search(query: SearchMoviesQuery): Promise<{ data: Movie[]; total: number }>;
}

export interface MoviesService {
  list(query: ListMoviesQuery): Promise<Paginated<Movie>>;
  search(query: SearchMoviesQuery): Promise<Paginated<Movie>>;
  getById(id: string): Promise<Movie>;
  create(input: CreateMovieInput): Promise<Movie>;
}
