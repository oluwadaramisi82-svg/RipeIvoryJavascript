#!/usr/bin/env bash
# Build the Ahmad & Toyibat wedding promo reel (9:16, ~40s)
set -euo pipefail
cd "$(dirname "$0")"

W=1080; H=1920; FPS=30
SER=fonts/cormorant.ttf
ITA=fonts/cormorant-italic.ttf
SAN=fonts/montserrat.ttf
ARB=fonts/amiri.ttf
GOLD=0xd7b66c
GOLDL=0xf1dfad
CREAM=0xf8f5ed

BG="gradients=s=${W}x${H}:c0=0x0d4b3a:c1=0x07372b:x0=200:y0=100:x1=900:y1=1800:speed=0.02"

fade_a () { # fade-in start, dur ; fade-out start, dur -> alpha expr
  echo "if(lt(t\,$1)\,0\,if(lt(t\,$1+$2)\,(t-$1)/$2\,1))"
}

mkdir -p scenes
SKIP12=${SKIP12:-0}

# ---------- Scene 1 (6s): Bismillah + You're invited ----------
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "$BG:d=6" -filter_complex "
[0:v]
drawtext=fontfile=$ARB:text='بسم الله الرحمن الرحيم':fontcolor=$GOLDL:fontsize=64:x=(w-tw)/2:y=560:alpha='$(fade_a 0.4 1.2)',
drawtext=fontfile=$ITA:text='With hearts full of gratitude':fontcolor=$CREAM:fontsize=58:x=(w-tw)/2:y=880:alpha='$(fade_a 1.6 1.0)',
drawtext=fontfile=$SAN:text='YOU ARE INVITED':fontcolor=$GOLD:fontsize=44:x=(w-tw)/2:y=1010:alpha='$(fade_a 2.4 1.0)',
drawbox=x=90:y=470:w=900:h=980:color=$GOLD@0.35:t=2:enable='gte(t,0.2)'
[v]" -map "[v]" -r $FPS -c:v libx264 -pix_fmt yuv420p scenes/s1.mp4

# ---------- Scene 2 (5s): Names ----------
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "$BG:d=5" -filter_complex "
[0:v]
drawtext=fontfile=$SER:text='Ahmad Opeyemi':fontcolor=$CREAM:fontsize=110:x=(w-tw)/2:y=680:alpha='$(fade_a 0.3 0.9)',
drawtext=fontfile=$ITA:text='&':fontcolor=$GOLD:fontsize=130:x=(w-tw)/2:y=850:alpha='$(fade_a 1.0 0.9)',
drawtext=fontfile=$SER:text='Toyibat Adeola':fontcolor=$CREAM:fontsize=110:x=(w-tw)/2:y=1040:alpha='$(fade_a 1.6 0.9)',
drawtext=fontfile=$SAN:text='ARE GETTING MARRIED':fontcolor=$GOLD:fontsize=42:x=(w-tw)/2:y=1260:alpha='$(fade_a 2.5 0.9)'
[v]" -map "[v]" -r $FPS -c:v libx264 -pix_fmt yuv420p scenes/s2.mp4

# ---------- Photo scenes ----------
photo_scene () { # img dur caption out pw ph py
  local img=$1 dur=$2 cap=$3 out=$4 pw=$5 ph=$6 py=$7
  local frames=$((dur*FPS))
  ffmpeg -hide_banner -loglevel error -y -f lavfi -i "$BG:d=$dur" -i "$img" -filter_complex "
[1:v]scale=trunc(${pw}*1.25/2)*2:trunc(${ph}*1.25/2)*2,zoompan=z='1+0.10*on/${frames}':d=${frames}:x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':s=${pw}x${ph}:fps=${FPS},
pad=w=iw+16:h=ih+16:x=8:y=8:color=$GOLD[ph];
[0:v][ph]overlay=x=(W-w)/2:y=${py}:shortest=1[b];
[b]drawtext=fontfile=$ITA:text='${cap}':fontcolor=$CREAM:fontsize=60:x=(w-tw)/2:y=${py}+${ph}+80:alpha='$(fade_a 0.8 1.0)'[v]
" -map "[v]" -r $FPS -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p "$out"
}

photo_scene ../attached_assets/image_1787078220009.png 7 "Love brought us together." scenes/s3.mp4 880 1316 220
photo_scene ../attached_assets/image_1787078235086.png 7 "Faith keeps us together." scenes/s4.mp4 880 1316 220
photo_scene ../attached_assets/image_1787076009857.png 6 "But God made it possible." scenes/s5.mp4 960 768 500
# ---------- Scene 6 (7s): Details ----------
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "$BG:d=7" -filter_complex "
[0:v]
drawtext=fontfile=$SAN:text='SAVE THE DATE':fontcolor=$GOLD:fontsize=44:x=(w-tw)/2:y=520:alpha='$(fade_a 0.3 0.8)',
drawtext=fontfile=$SER:text='Saturday':fontcolor=$CREAM:fontsize=96:x=(w-tw)/2:y=640:alpha='$(fade_a 0.9 0.8)',
drawtext=fontfile=$SER:text='21 November 2026':fontcolor=$CREAM:fontsize=96:x=(w-tw)/2:y=770:alpha='$(fade_a 1.2 0.8)',
drawtext=fontfile=$SAN:text='11\:00 AM':fontcolor=$GOLDL:fontsize=48:x=(w-tw)/2:y=930:alpha='$(fade_a 1.8 0.8)',
drawtext=fontfile=$SER:text='Adetola Hall':fontcolor=$CREAM:fontsize=76:x=(w-tw)/2:y=1080:alpha='$(fade_a 2.6 0.8)',
drawtext=fontfile=$SAN:text='Imowo Eleran\, Ijebu Ode':fontcolor=$GOLDL:fontsize=44:x=(w-tw)/2:y=1190:alpha='$(fade_a 3.0 0.8)',
drawtext=fontfile=$ITA:text='Reception follows at Rolak Hotel and Suites':fontcolor=$CREAM:fontsize=46:x=(w-tw)/2:y=1330:alpha='$(fade_a 3.8 0.8)',
drawbox=x=90:y=440:w=900:h=1020:color=$GOLD@0.35:t=2
[v]" -map "[v]" -r $FPS -c:v libx264 -pix_fmt yuv420p scenes/s6.mp4

# ---------- Scene 7 (6s): Closing ----------
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "$BG:d=6" -filter_complex "
[0:v]
drawtext=fontfile=$ITA:text='The countdown has begun...':fontcolor=$CREAM:fontsize=64:x=(w-tw)/2:y=820:alpha='$(fade_a 0.4 1.0)',
drawtext=fontfile=$SER:text='Ahmad  &  Toyibat':fontcolor=$GOLD:fontsize=92:x=(w-tw)/2:y=960:alpha='$(fade_a 1.6 1.0)',
drawtext=fontfile=$SAN:text='21 . 11 . 2026':fontcolor=$GOLDL:fontsize=48:x=(w-tw)/2:y=1120:alpha='$(fade_a 2.4 1.0)'
[v]" -map "[v]" -r $FPS -c:v libx264 -pix_fmt yuv420p scenes/s7.mp4

# ---------- Crossfade chain ----------
# durations: 6 5 7 7 6 7 6 ; xfade 0.7s each
ffmpeg -hide_banner -loglevel error -y \
 -i scenes/s1.mp4 -i scenes/s2.mp4 -i scenes/s3.mp4 -i scenes/s4.mp4 \
 -i scenes/s5.mp4 -i scenes/s6.mp4 -i scenes/s7.mp4 -filter_complex "
[0:v][1:v]xfade=transition=fade:duration=0.7:offset=5.3[x1];
[x1][2:v]xfade=transition=fade:duration=0.7:offset=9.6[x2];
[x2][3:v]xfade=transition=fade:duration=0.7:offset=15.9[x3];
[x3][4:v]xfade=transition=fade:duration=0.7:offset=22.2[x4];
[x4][5:v]xfade=transition=fade:duration=0.7:offset=27.5[x5];
[x5][6:v]xfade=transition=fade:duration=0.7:offset=33.8[v]
" -map "[v]" -r $FPS -c:v libx264 -pix_fmt yuv420p scenes/silent.mp4

# ---------- Music ----------
if [ -f music.mp3 ]; then
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 scenes/silent.mp4)
  ffmpeg -hide_banner -loglevel error -y -i scenes/silent.mp4 -i music.mp3 -filter_complex "
  [1:a]atrim=0:${DUR},afade=t=in:d=1.5,afade=t=out:st=$(echo "$DUR-2.5"|bc):d=2.5,volume=0.9[a]
  " -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k ../attached_assets/generated_videos/ahmad-toyibat-promo.mp4
else
  cp scenes/silent.mp4 ../attached_assets/generated_videos/ahmad-toyibat-promo.mp4
fi
echo DONE
ffprobe -v error -show_entries format=duration,size -of default=nw=1 ../attached_assets/generated_videos/ahmad-toyibat-promo.mp4
