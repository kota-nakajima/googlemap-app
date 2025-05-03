import React, { useState, useEffect, useRef } from "react"
// import { collection, getDocs, query, where } from "firebase/firestore"
// import { db } from "../firebase"
import { fetchFavorites } from "../lib/favorites"
import FavoriteMap from "../components/FavoriteMap"
import FavoriteTable from "../components/FavoriteTable"
import { useAuth } from "../AuthContext"
import "../css/common.css"

const Favorite: React.FC = () => {
  const { currentUser } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])

  const mapRef = useRef<{ openInfoWindow: (placeId: string) => void }>(null)

  const handleShopClick = (placeId: string) => {
    if (mapRef.current) {
      mapRef.current.openInfoWindow(placeId)
    }
  }

  // ここでFavoriteを検索してFavoriteMapとFavoriteTableに渡す
  useEffect(() => {
    if (!currentUser) return
  
    fetchFavorites(currentUser.uid)
      .then(raw => {
        // geometry が文字列ならパース
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
      })
      .catch(err => {
        console.error('fetchFavorites エラー', err)
      })
  }, [currentUser])
  

  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="result-title">
            <h2>お気に入りリスト</h2>
          </div>
          <div className="result-items">
            <div className="result-table">
              <FavoriteTable favorites={favorites} onShopClick={handleShopClick} />
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
