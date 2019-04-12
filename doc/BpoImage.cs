using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace NT.OnlineMarking.Libraries.BPO
{
    public class BpoImage
    {
        public ObjectId Id
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        public BpoCT CT
        {
            get;
            set;
        }

        public List<BpoDR> DR
        {
            get;
            set;
        }

        public List<BpoPictrue> Thumbnails
        {
            get;
            set;
        }

        public List<BpoPictrue> Photos
        {
            get;
            set;
        }
    }

    public class BpoCT
    {
        public string URL
        {
            get;
            set;
        }

        public string VolumeData
        {
            get;
            set;
        }

        public string Suspect
        {
            get;
            set;
        }

        public string Density
        {
            get;
            set;
        }
    }

    public class BpoDR
    {
        public string URL
        {
            get;
            set;
        }

        public int Perspective
        {
            get;
            set;
        }

        public string Suspect
        {
            get;
            set;
        }
    }

    public class BpoPictrue
    {
        public string URL
        {
            get;
            set;
        }

        public string Thumbnail
        {
            get;
            set;
        }
    }
}
