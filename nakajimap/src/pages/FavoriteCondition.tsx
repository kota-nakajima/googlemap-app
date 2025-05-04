import React, { useEffect, useState } from "react"
import { Box, TextField, Typography, Button, CircularProgress } from "@mui/material"
import { fetchFilters, deleteFilter } from "../lib/filters"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthContext"

const FavoriteCondition: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // null = ローディング中, [] = 取得済みだがデータなし, [ ... ] = データあり
  const [savedFilters, setSavedFilters] = useState<any[] | null>(null)

  const priceLevels = [
    { label: "指定なし", p_level: undefined },
    { label: "¥", p_level: 1 },
    { label: "¥¥", p_level: 2 },
    { label: "¥¥¥", p_level: 3 },
    { label: "¥¥¥¥", p_level: 4 },
  ]
  const getPriceLabel = (level: number | undefined): string => {
    const priceLevel = priceLevels.find((pl) => pl.p_level === level)
    return priceLevel ? priceLevel.label : ""
  }

  const fetchSavedFilters = async () => {
    if (!currentUser) return
    try {
      const list = await fetchFilters(currentUser.uid)
      setSavedFilters(list)
    } catch (error) {
      console.error("Error fetching filters:", error)
      setSavedFilters([])
    }
  }

  const handleSearch = (filter: any) => {
    navigate("/home", { state: filter })
  }

  const handleDelete = async (id: string) => {
    // savedFilters をローカル変数に保持して narrow することで null 可能性を解消
    const currentFilters = savedFilters
    if (!currentFilters) return
    try {
      await deleteFilter(id)
      // @ts-ignore: currentFilters は null でないことが保証されている
      setSavedFilters(currentFilters.filter((filter) => filter.id !== id))
    } catch (error) {
      console.error("Error deleting document: ", error)
    }
  }

  useEffect(() => {
    fetchSavedFilters()
  }, [currentUser])

  if (savedFilters === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className="container">
      {savedFilters.length === 0 ? (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 4, color: "text.secondary" }}
        >
          お気に入り条件が保存されていません
        </Typography>
      ) : (
        savedFilters.map((filter, idx) => (
          <div className="content" key={filter.id || idx}>
            <div className="filter-favcondition">
              <div className="favcondition-title">
                <h2>お気に入り条件 {idx + 1}</h2>
              </div>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <TextField
                  label="エリア・駅"
                  value={filter.location}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#fcfcfc" }}
                />
                <Typography sx={{ whiteSpace: "nowrap" }}>周辺</Typography>
                <TextField
                  label="範囲"
                  type="number"
                  value={filter.radius}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#fcfcfc" }}
                />
                <Typography sx={{ whiteSpace: "nowrap" }}>m以内</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  label="料理のジャンル"
                  value={filter.cuisine}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#fcfcfc" }}
                />
                <Typography sx={{ whiteSpace: "nowrap" }}>価格レベル</Typography>
                <TextField
                  label="予算下限"
                  type="text"
                  value={getPriceLabel(filter.minBudget)}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#fcfcfc" }}
                />
                <Typography sx={{ whiteSpace: "nowrap" }}>~</Typography>
                <TextField
                  label="予算上限"
                  type="text"
                  value={getPriceLabel(filter.maxBudget)}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#fcfcfc" }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  label="口コミ数はいくつ以上か"
                  type="number"
                  value={filter.reviewCount}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#fcfcfc" }}
                />
                <TextField
                  label="☆評価の数はいくつ以上か"
                  type="number"
                  value={filter.rating}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#fcfcfc" }}
                />
              </Box>
              <Box mt={3} sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSearch(filter)}
                >
                  検索
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(filter.id)}
                >
                  削除
                </Button>
              </Box>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default FavoriteCondition
