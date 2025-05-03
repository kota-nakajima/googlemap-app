import React, { useEffect } from "react"
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"

const Navbar: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/auth")
    })
    return () => unsubscribe()
  }, [navigate])

  return (
    <>
      {/* これで body の余白をリセット */}
      <CssBaseline />

      {/* position="fixed" + left/right/top で常に画面端にぴったり */}
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          left: 0,
          right: 0,
          width: "100vw",       // あるいは "100%" でもOK
          boxSizing: "border-box"
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: "pointer", fontSize: "1.5rem", letterSpacing: "0.2rem" }}
              onClick={() => navigate("/home")}
            >
              nakajimap
            </Typography>
          </Box>
          <Button color="inherit" onClick={() => navigate("/favorite")} sx={{ fontSize: "0.9rem" }}>
            お気に入りリスト
          </Button>
          <Button color="inherit" onClick={() => navigate("/favorite_condition")} sx={{ fontSize: "0.9rem" }}>
            お気に入り条件
          </Button>
          <Button
            color="inherit"
            onClick={async () => { await auth.signOut(); navigate("/auth") }}
            sx={{ fontSize: "0.9rem" }}
          >
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>
      {/* コンテンツがナビに隠れないよう、ここで高さ分だけ余白を空ける */}
      <Toolbar />
    </>
  )
}

export default Navbar
