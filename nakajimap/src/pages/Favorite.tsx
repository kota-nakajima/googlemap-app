import React, { useState, useEffect, useRef } from "react"
import { Box, CircularProgress, Typography } from "@mui/material"
import { fetchFavorites } from "../lib/favorites"
import FavoriteMap from "../components/FavoriteMap"
import FavoriteTable from "../components/FavoriteTable"
import { useAuth } from "../AuthContext"
import "../css/common.css"

const Favorite: React.FC = () => {
  const { currentUser } = useAuth()
  const [favorites, setFavorites] = useState<any[] | null>(null)

  const mapRef = useRef<{ openInfoWindow: (placeId: string) => void }>(null)

  const handleShopClick = (placeId: string) => {
    if (mapRef.current) {
      mapRef.current.openInfoWindow(placeId)
    }
  }

  // ここでFavoriteを検索してFavoriteMapとFavoriteTableに渡す
  useEffect(() => {
    const load = async () => {
      if (!currentUser) return
      try {
        const raw = await fetchFavorites(currentUser.uid)
        const parsed = raw.map(item => {
          const geom = typeof item.geometry === 'string'
            ? JSON.parse(item.geometry)
            : item.geometry
          return {
            ...item,
            lat: geom.location.lat,
            lng: geom.location.lng,
          }
        })
        setFavorites(parsed)
      } catch (err) {
        console.error('fetchFavorites エラー', err)
        setFavorites([])
      }
    }
    load()
  }, [currentUser])

  if (favorites === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
  

  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="result-title">
            <h2>お気に入りリスト</h2>
          </div>
          <div className="result-items">
            <div className="result-table">
              {favorites.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                  お気に入りが登録されていません
                </Typography>
              ) : (
              <FavoriteTable favorites={favorites} onShopClick={handleShopClick} />
              )}
            </div>
            <div className="result-map">
              <FavoriteMap ref={mapRef} favorites={favorites} onMarkerClick={handleShopClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Favorite
