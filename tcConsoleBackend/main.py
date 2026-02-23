from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import auth, initialization, intake, samsubmission, items, projectsinfo, projectforms, projectsrepos, llinter

app = FastAPI(title= "tConsole", version= "V.0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],      
    allow_credentials=True, 
    allow_headers=["*"],      
    allow_methods=["*"]  
 )

app.include_router(auth.router)
app.include_router(initialization.router)
app.include_router(intake.router)
app.include_router(samsubmission.router)
app.include_router(items.router)
app.include_router(projectsinfo.router)
app.include_router(projectforms.router)
app.include_router(projectsrepos.router)
app.include_router(llinter.router)

@app.get("/")
def root():
    return{"status" : "tConsole is live"}

#if __name__ == "__main__":
 #   uvicorn.run( port= 6050, reload=True)
