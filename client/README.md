# Rock Paper Scissor DApp

## Dependencies

### Linux packages

Assuming you are using a Debian/Ubuntu-based distribution:

```bash
sudo apt-get install libgl1-mesa-dev libxdamage1 libnss3 libxkbcommon-x11-0 libasound2 libxcb-xinerama0 libxcb-icccm4 libxcb-keysyms1 libxcb-xkb1
```

### Python packages

```bash
pip install pywebview[qt]
```

## Run the client

First, build the app using the following command:

```bash
cd gui && npm run build
```

This will create a folder name `dist`. Note that the current setup only produces production-mode file, so no debugging (yet).

```bash
python main.py
```