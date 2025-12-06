export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
    }
}

// Temel film arama/keşfetme fonksiyonu
export const fetchMovies = async ({ query }: { query: string }) => {
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=tr-TR`
        : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&language=tr-TR`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
}

// Tek film detayı getirme
export const fetchMovie = async (movieId: string) => {
    try {
        // movieId format: "27205-inception" veya sadece "27205" olabilir
        const id = movieId.split('-')[0];

        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/movie/${id}?language=tr-TR`,
            {
                method: "GET",
                headers: TMDB_CONFIG.headers,
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch movie details: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        throw error;
    }
}

// Film arama (CollectionDetail için)
export const searchMovies = async (query: string) => {
    try {
        if (!TMDB_CONFIG.API_KEY) {
            throw new Error("TMDB API anahtarı tanımlanmamış! Lütfen .env dosyasını kontrol edin.");
        }

        if (!query.trim()) {
            return { results: [] };
        }

        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=tr-TR&page=1&include_adult=false`,
            {
                method: "GET",
                headers: TMDB_CONFIG.headers
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("TMDB API anahtarı geçersiz! Lütfen doğru bir Bearer token kullanın.");
            }
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error searching movies:", error);
        throw error;
    }
}

// Popüler filmler
export const getTrendingMovies = async () => {
    try {
        if (!TMDB_CONFIG.API_KEY) {
            throw new Error("TMDB API anahtarı tanımlanmamış!");
        }

        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/trending/movie/week?language=tr-TR`,
            {
                method: "GET",
                headers: TMDB_CONFIG.headers
            }
        );

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        throw error;
    }
};